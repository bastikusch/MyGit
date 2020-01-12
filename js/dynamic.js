// const math = require('mathjs');

//...........................................................................................................

function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function shiftAngles(InA) {
    InA = math.abs(InA) > 180 ? math.mod(InA + 180, 2 * 180) - 180 : InA;
    return InA;
}

function update_loc(fl_hrs,hourly_del_Lat,curr_Lat,curr_Lon,curr_head,incl_wind,u_wind,v_wind) {

    // note angles are relative to South (so we add pi)
    //var dLon = math.dotMultiply(fl_hrs, math.dotDivide(hourly_del_Lat, math.dotMultiply(math.cos(curr_Lat), math.dotMultiply(math.sin(math.pi + curr_head) + incl_wind, u_wind))));
    let dLon = math.dotDivide(math.dotMultiply(fl_hrs, hourly_del_Lat), math.cos(curr_Lat));
    dLon = math.dotMultiply(dLon, (math.sin(math.pi+curr_head) + math.dotMultiply(incl_wind, u_wind)));
    let dLat = math.dotMultiply(fl_hrs, math.dotMultiply(hourly_del_Lat, (math.cos(math.pi + curr_head) + math.dotMultiply(incl_wind, v_wind))));
    let Lon = curr_Lon + dLon; // % mod( ,2*pi);
    let Lat = curr_Lat + dLat;
    // account for polar crossing
    Lat = Lat > math.pi / 2 ? math.pi - Lat : Lat;
    // set Lon between -pi and pi
    Lon = shiftAngles(Lon * 180 / math.pi) * math.pi / 180;
    return [Lat, Lon]
}

function calc_init_heads(a, b, deg2rad, magnet) {
    if (magnet == 1){
        return math.dotMultiply(a, deg2rad)
    } else {
        return math.dotMultiply(b, deg2rad)
    }
}

function migration(sys_nr, magn_comp_type, wind, maxdays) {

    // general inits
    //let magn_comp_type = 2; // compass type 1 = magnetoclinic 2 = inclination gradient shifted
    let Va = 12 * 3.6; // bird air speed in km/h (via m/s)
    let R_Earth_km = 6371;
    let hourly_del_Lat = Va / R_Earth_km; // hourly change Lat if SouthboundLon will have 1/sin(theta) factor (below)
    let fl_hrs = 8;
    let max_mig_dur = maxdays; // max duration (days)
    let res_tot = new Array();

    // Latitude calcs
    let Lat_dep = 60; // Latitude = theta
    let Lat_arr = -5;
    let rad2deg = 180 / math.pi;
    let deg2rad = math.pi / 180;
    let theta_0 = Lat_dep * deg2rad;
    let theta_f = Lat_arr * deg2rad; // destination Lat (sys_nr>2 && sys_nr<5)*(5*deg2rad); % 0; %

    // compass imprecision (std in degrees)
    let std_head = 5;
    let compass_std = std_head * deg2rad;

    let llamda_0, init_heads;
    switch (sys_nr) {

        case 1: // E Arctic Canada to S America

            llamda_0 = -100 * deg2rad; // + (magn_comp_nr == 4)*-130*deg2rad;
            init_heads = calc_init_heads([-60, -65, -70, -75], [-30, -35, -40, -45], deg2rad, magn_comp_type);
            break;

        case 2: // W Arctic Canada to S America

            llamda_0 = -130 * deg2rad;
            init_heads = calc_init_heads([-70, -75, -80, -85], [-50, -55, -60, -65], deg2rad, magn_comp_type);
            break;

        case 3: // W Europe to W Africa

            llamda_0 = 20 * deg2rad; // % + (magn_comp_nr == 4)*60*deg2rad;
            init_heads = calc_init_heads([35, 45, 55, 65], [20, 25, 30, 35], deg2rad, magn_comp_type);
            break;

        case 4: // E Europe to Africa

            llamda_0 = 60 * deg2rad;
            init_heads = calc_init_heads([55, 65, 75, 85], [40, 45, 50, 55], deg2rad, magn_comp_type);
            break;

        case 5: // Alaska to Africa

            llamda_0 = -160 * deg2rad;
            init_heads = calc_init_heads([100, 110, 120, 130], [60, 70, 80, 90], deg2rad, magn_comp_type);
            break;

        case 6: // C. Siberia to Africa

            llamda_0 = 80 * deg2rad;
            init_heads = calc_init_heads([30, 50, 70, 90], [30, 40, 50, 60], deg2rad, magn_comp_type)
    }

    // initialize magnetic components assuming (non-tilted) dipole geomagnetic field
    let inclin_0 =  math.atan(2 * math.tan(theta_0));
    let magncl_0 = math.dotDivide(math.tan(inclin_0), math.sin(init_heads));

    for (ia = 0; ia < init_heads.length; ia++) {

        let theta = [theta_0];
        let llamda = [llamda_0];
        let cumul_flts = [1];
        let cumul_wtr_flts = [0];
        let alpha = [init_heads[ia]];
        let res = [{"latitude": theta_0, "longitude": llamda_0}];

        // set relevant parameter depending on compass type
        let magn_param_0 = (magn_comp_type == 1) * magncl_0[ia] + (magn_comp_type == 2) * inclin_0;
        // initially no deviation from solar or geomagnetic fields

        let d_alpha_magn = [0];

        // n_step is flight step (date_step varies with flight and stopover durations)
        let n_step = 0;
        let arrived = false;
        let survived = 1;

        // march through flight steps until target Lat or maximum time reached
        while (!arrived && n_step < max_mig_dur) {

            let curr_Lat = theta[n_step];
            let curr_Lon = llamda[n_step];
            // alpha is current heading relative to South
            let curr_head = alpha[n_step];
            // at this point the heading is determined we now need to assess where and for how long to stop
            // calculate candidate arrival location may be adjusted below based on topography
            let incl_wind = wind[0];
            let u_wind = wind[1];
            let v_wind = wind[2];
            [theta[n_step+1], llamda[n_step+1]] = update_loc(fl_hrs, hourly_del_Lat, curr_Lat, curr_Lon, curr_head, incl_wind, u_wind, v_wind);
            // Also, we use that for dipole, tan(inclin angle) = 2*tan(theta)
            let tan_incl = 2*math.tan(theta[n_step+1]);
            let magn_param = [0];
            magn_param[n_step+1] = math.atan(tan_incl);

            // compute base shift heading (compass type 1 only)
            let base_magn_shift = math.abs(magn_param[n_step + 1] / magn_param_0) - 1;
            d_alpha_magn[n_step + 1] = -alpha[0] * math.abs(base_magn_shift);

            // determine random orientation component (we increased uncertainty when reoriented over water)
            let d_alpha_rnd = [0];
            d_alpha_rnd[n_step+1] = compass_std * randn_bm();

            // if (imag(d_alpha_magn(n_step+1)) ~=0)
            // {
            //     var d_alpha_magn[n_step + 1] = (alpha(1) <= 0) * (-pi) + (alpha(1) > 0) * pi - alpha(1);
            // }

            // Now, determine increment to candidate heading for departure from this "next" location (n_step+1), relative to geographic South
            let d_alpha_tot = d_alpha_magn[n_step+1] + d_alpha_rnd[n_step+1]; // sign(alph(1))*mod( ,2*pi); d_alpha_tot = sign(d_alpha_tot)*min(abs(d_alpha_tot),d_alpha_max);
            alpha[n_step+1] = math.mod(alpha[0] + d_alpha_tot + math.pi, 2 * math.pi) - math.pi;

            let check_lost1 = (theta[n_step+1] > 88 * math.pi / 180);
            let check_lost2 = (theta[n_step] > 88 * math.pi / 180);

            let lost = check_lost1 && check_lost2 ? 1 : 0;
            arrived = theta[n_step+1] <= theta_f;

            res[n_step] = {"latitude": theta[n_step] * rad2deg, "longitude": llamda[n_step] * rad2deg};
            arrived = theta[n_step] <= theta_f;
            // lastly, increment migration step
            n_step = n_step+1;
        }

        // rewrite heading vs. geographic North
        let heads = 180 + alpha * rad2deg;
        let n_steps = [0];
        n_steps[ia] = n_step;
        res_tot[ia] = res;

    }
    return res_tot;

}

function randomwalk(start, n, gen, path_length) {
    var res = new Array();
    for (j = 0; j < n; j++) {
        var ar = [{"latitude": start[0], "longitude": start[1]}];
        r = Array.from({length: gen}, () => randn_bm() * Math.PI/6 + Math.PI);
        r[0] = 0;
        for (i = 1; i < gen; i++) {
            while (Math.abs(ar[i - 1].latitude + path_length * Math.cos(r[i])) > 83 || Math.abs(ar[i - 1].longitude + path_length * Math.sin(r[i])) > 180) {
                r[i] = Math.random() * 2 * Math.PI;
            }
            ar[i] = {
                latitude: ar[i - 1].latitude + path_length * Math.cos(r[i]),
                longitude: ar[i - 1].longitude + path_length * Math.sin(r[i])
            }
        }
        res[j] = ar;
    }
    return res;
}

//console.log(migration(1, 1, [1, 1, 1]));


