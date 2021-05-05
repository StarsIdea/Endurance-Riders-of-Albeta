const {remote} = require('electron');
const eventdbInstance = remote.getGlobal('eventdb');
const racedbInstance = remote.getGlobal('racedb');
const riderdbInstance = remote.getGlobal('riderdb');
const event_id = remote.getGlobal('sharedObj').event_id;

eventdbInstance.read(event_id).then(event => {
    $('.event_list .event-name').html(event.name);
    $('.event_list .event-date').html(event.date);
});

$(document).ready(function(){
    view_rider_list();
});

function view_rider_list(){
    racedbInstance.findRaceByEvent(event_id).then(race => {
        raceIds = [];
        for(i = 0; i < race.length; i ++){
            raceIds.push(race[i]._id);
        }
        riderdbInstance.findRidersByRaces(raceIds).then(riders => {
            rider_list = '';
            for(j = 0; j < riders.length; j ++){
                rider_list += '<tr>';
                rider_list += '    <td>'+riders[j].rider_number+'</td>';
                rider_list += '    <td>'+riders[j].rider_name+'</td>';
                rider_list += '    <td>'+riders[j].amount_paid+'</td>';
                rider_list += '    <td>'+riders[j].payment_method+'</td>';
                rider_list += '    <td>'+riders[j].payment_note+'</td>';
                rider_list += '    <th scope="row">';
                rider_list += '    <div class="form-check">';
                rider_list += '        <input';
                rider_list += '        class="form-check-input"';
                rider_list += '        type="checkbox"';
                rider_list += '        />';
                rider_list += '    </div>';
                rider_list += '    </th>';
                rider_list += '</tr>';
            }
            if(rider_list != '')
                $('.event_list .list table tbody').html(rider_list);
        });
    });
}