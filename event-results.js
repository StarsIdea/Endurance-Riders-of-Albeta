const {remote} = require('electron');

const eventdbInstance = remote.getGlobal('eventdb');
const racedbInstance = remote.getGlobal('racedb');
const riderdbInstance = remote.getGlobal('riderdb');
const event_id = remote.getGlobal('sharedObj').event_id;

eventdbInstance.read(event_id).then(event => {
    $('.event_list .event-name').html(event.name);
    $('.event_list .event-date').html(event.date);
});

racedbInstance.findRaceByEvent(event_id).then(race =>{
    race_list = '';
    for(i = 0; i < race.length; i ++){
        race_list += '<option title="'+race[i].distance+' miles" value="'+race[i]._id+'">'+race[i].distance+' miles</option>';
    }
    $('.event_list #selected_race').html(race_list);
    
    // $('select').selectpicker();
});

$(document).ready(function(){
        
    
    rider_results('senior');
    $('#selected_race').change(function(){
      rider_results($(this).val());
    });
    $('.btnprn').printPage();
});
function rider_results(rider_category){
    race_id = $('#selected_race').val();
    $('.btnprn').attr('href', '/rides/app/event_result_print_page/<?php echo $event->id;?>/'+race_id+'/'+rider_category)
    
    // $.ajaxSetup({
    //     headers: {
    //         'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
    //     }
    // });
    // jQuery.ajax({
    //     url: "/rides/app/getRiders_Results/"+race_id,
    //     method: 'get',
    //     data: {},
    //     success: function(result){
    riderdbInstance.findRiderByRace(race_id).then(rider => {
        senior_section = '';
        youth_section = '';
        junior_section = '';
        if(rider.length > 0){
            for(i = 0; i < rider.length; i ++){
                row = '<tr>';
                row += '<td>'+(rider[i].placing?rider[i].placing:'')+'</td>';
                row += '<td>'+rider[i]._id+'</td>';
                row += '<td>'+rider[i].rider_name+'</td>';
                row += '<td>'+rider[i].rider_id+'</td>';
                row += '<td>'+rider[i].horse_name+'</td>';
                row += '<td>'+rider[i].horse_id+'</td>';
                row += '<td>'+(rider[i].finish_time?rider[i].finish_time:'')+'</td>';
                row += '<td>'+(rider[i].pull_code?rider[i].pull_code_name:'')+'</td>';
                row += '<td>'+(rider[i].weight?rider[i].weight:'')+'</td>';
                row += '<td>'+(rider[i].vetScore?rider[i].vetScore:'')+'</td>';
                row += '<td>'+(rider[i].bcScore?rider[i].bcScore:'')+'</td>';
                row += '<td>'+(rider[i].ridePoints?rider[i].ridePoints:'')+'</td>';
                row += '<td>'+(rider[i].bcPoints?rider[i].bcPoints:'')+'</td>';
                row += '<td>'+(rider[i].bcPlacing?rider[i].bcPlacing:'')+'</td>';
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
    //     }
    // });
    });
}