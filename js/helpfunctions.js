// get normal distributed random number
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

// shift angles if cross north south
function shiftAngles(InA) {
    InA = math.abs(InA) > 180 ? math.mod(InA + 180, 2 * 180) - 180 : InA;
    return InA;
}

// calculate the updated location
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

// calculate initial headings
function calc_init_heads(a, b, deg2rad, magnet) {
    if (magnet == 1){
        return math.dotMultiply(a, deg2rad)
    } else {
        return math.dotMultiply(b, deg2rad)
    }
}

function magnetField(latitude){
    let deg2rad = math.pi / 180;
    let theta = deg2rad * latitude
    let inclin = math.atan(2 * math.tan(theta));
    return inclin
}