const {remote} = require('electron');

const eventdbInstance = remote.getGlobal('eventdb');
const racedbInstance = remote.getGlobal('racedb');
const riderdbInstance = remote.getGlobal('riderdb');
const event_id = remote.getGlobal('sharedObj').event_id;
const race_id = remote.getGlobal('sharedObj').race_id;
const rider_category = remote.getGlobal('sharedObj').rider_category;

eventdbInstance.read(event_id).then(event => {
    $('.event_list .event-name').html(event.name);
    $('.event_list .event-date').html(event.date);
});

racedbInstance.read(race_id).then(race => {
    $('.event_list .race').html(race.distance + " miles");
});

$('.event_list .category').html(rider_category + " Results")

$(document).ready(function(){
    rider_results();
});
function rider_results(){
    
    riderdbInstance.findRiderByRace(race_id).then(rider => {
        result_section = '';
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
                if(rider[i].category == rider_category)
                    result_section += row;
            }
        }
        $('table tbody').html(result_section);
    });
}