const {remote} = require('electron');

const eventdbInstance = remote.getGlobal('eventdb');
const racedbInstance = remote.getGlobal('racedb');
const riderdbInstance = remote.getGlobal('riderdb');
const event_id = remote.getGlobal('sharedObj').event_id;
const url = require('url')
const path = require('path')
const BrowserWindow = remote.BrowserWindow;
eventdbInstance.read(event_id).then(event => {
    $('.event_list .event-name').html(event.name);
    $('.event_list .event-date').html(event.date);
});

racedbInstance.findRaceByEvent(event_id).then(race =>{
    race_list = '';
    for(i = 0; i < race.length; i ++){
        race_list += '<option distance="'+race[i].distance+'" value="'+race[i]._id+'">'+race[i].distance+' miles</option>';
    }
    $('.event_list #selected_race').html(race_list);
    calucate_result('senior')
});



$(document).ready(function(){
    
    $('#selected_race').change(function(){
        calucate_result('senior');
    });
    $('.btnprn').click(function(){
        let win = new BrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: true
            }
        });
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'event_result_print_page.html'),
            protocol: 'file:',
            slashes: true
        }))
    
        win.webContents.on('did-finish-load', () => {
            win.webContents.print();
        });
    });
});
function rider_results(rider_category = 'senior'){
    race_id = $('#selected_race').val();
    remote.getGlobal('sharedObj').race_id = race_id;
    // remote.getGlobal('sharedObj').rider_category = rider_category;
    riderdbInstance.findRiderByRace(race_id).then(rider => {
        senior_section = '';
        youth_section = '';
        junior_section = '';
        if(rider.length > 0){
            for(i = 0; i < rider.length; i ++){
                row = '<tr>';
                row += '<td>'+(rider[i].placing<=9999999999?rider[i].placing:'')+'</td>';
                row += '<td>'+rider[i].rider_number+'</td>';
                row += '<td>'+rider[i].rider_name+'</td>';
                row += '<td>'+rider[i].rider_id+'</td>';
                row += '<td>'+rider[i].horse_name+'</td>';
                row += '<td>'+rider[i].horse_id+'</td>';
                row += '<td>'+rider[i].rideTime+'</td>';
                row += '<td>'+rider[i].pull_code+'</td>';
                row += '<td>'+rider[i].weight+'</td>';
                row += '<td>'+rider[i].vetScore+'</td>';
                row += '<td>'+rider[i].bcScore+'</td>';
                row += '<td>'+rider[i].ridePoints+'</td>';
                row += '<td>'+rider[i].bcPoints+'</td>';
                row += '<td>'+rider[i].bcPlacing+'</td>';
                row += '</tr>';
                switch(rider[i].category){
                    case 'senior':
                        senior_section += row;
                        break;
                    case 'youth':
                        youth_section += row;
                        break;
                    case 'junior':
                        junior_section += row;
                        break;
                }
            }
        }
        $('#senior tbody').html(senior_section);
        $('#youth tbody').html(youth_section);
        $('#junior tbody').html(junior_section);
    });
}

function calucate_result(rider_category){
    console.log('placing');
    race_id = $('#selected_race').val();
    console.log(race_id);
    distance = $('#selected_race').find(":selected").attr('distance');
    console.log(distance);
    // rider_category = remote.getGlobal('sharedObj').rider_category?remote.getGlobal('sharedObj').rider_category:'senior';
    console.log(rider_category);
    riderdbInstance.findRiderByRace_rank(race_id, rider_category).then(rider => {
        if(rider.length > 0){
            riderdbInstance.findMaxWeight(race_id, rider_category).then(max_weight_rider => {
                rider_total_number = rider.length;
                ranking = 1;
                for(var i = 0; i < rider.length; i ++){
                    if(finish_time_to_minute(rider[i].finish_time) == 0 || rider[i].finish_time == ''){
                        console.log('==========='+distance);
                        if(rider[i].pull_code == 'None'){
                            rider[i].placing = 999999999999;
                        }
                        else{
                            rider[i].placing = 9999999999999;
                        }
                        continue;
                    }
                    rider[i].placing = ranking;
                    ranking ++;
                    points = 0;
                    ridePoints = calc_points(rider_category, rider_total_number - i);
                    if(distance >= 50 && distance < 75){
                        points = distance * ridePoints;
                    }
                    else if(distance >= 75 && distance < 100){
                        points = 1.25 * distance * ridePoints;
                    }
                    else if(distance >= 100){
                        points = 1.5 * distance * ridePoints;
                    }
                    else{
                        points = '';
                    }
                    rider[i].vetScore = (rider[i].recovery_score *  10 + rider[i].hydration_score *  10 + rider[i].lesions_score *  10 + rider[i].soundness_score *  10 + rider[i].quality_of_movement_score *  10);
                    rider[i].ridePoints = points;
                    if(distance >= 50){
                        rider[i].bcScore = rider[i].vetScore * 1 + (200 - (finish_time_to_minute(rider[i].finish_time) * 1 - finish_time_to_minute(rider[0].finish_time) * 1)/60) + (100 - (max_weight_rider[0].weight * 1 - rider[i].weight * 1)/2);
                        rider[i].bcScore = Math.floor(rider[i].bcScore*100)/100;
                    }
                }
                rider.sort((a,b) =>  b.bcScore-a.bcScore );
                for(i = 0; i < rider.length; i ++){
                    if(rider[i].bcScore == '' || i > 10){
                        break;
                    }
                    if(i == 0){
                        if(rider_total_number < 10)
                            rider[i].bcPoints = 0.1 * rider_total_number * distance;
                        else
                            rider[i].bcPoints = distance;

                        rider[i].bcPoints = Math.floor(rider[i].bcPoints*100)/100;
                    }
                    else{
                        rider[i].bcPoints = '';
                    }
                    rider[i].bcPlacing = i + 1;
                }
                rider.forEach(item => {
                    riderdbInstance.update(item._id, item);
                });
                rider_results(rider_category);
            });
        }
        else{
            rider_results(rider_category);
        }
    });
    
}

function calc_points(rider_category, rider_total_number){
    var total_points = 0;
    var index = [];
    for(var i = 0; i < 11; i ++){
        index[i] = (i < rider_total_number) ? 1 : 0;
    }
    switch(rider_category){
        case 'senior':
        case 'youth':
            total_points = 1.0 * index[0] + 0.5 * index[1] + 0.3 * index[2] + 0.2 * index[3] + 0.2 * index[4] + 0.2 * index[5] + 0.2 * index[6] + 0.1 * index[7] + 0.1 * index[8] + 0.1 * index[9] + 0.1 * index[10];
            break;
        case 'junior':
            total_points = 1.0 * index[0] + 0.8 * index[1] + 0.4 * index[2] + 0.4 * index[3] + 0.2 * index[4] + 0.2 * index[5];
            break;
    }
    return total_points;
}

function finish_time_to_minute(finish_time){
    total_minute = 0;
    parse_time = finish_time.split(':');
    total_minute = parse_time[0]*60 + parse_time[1] * 1;
    return total_minute;
}