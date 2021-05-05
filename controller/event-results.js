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
        race_list += '<option title="'+race[i].distance+' miles" value="'+race[i]._id+'">'+race[i].distance+' miles</option>';
    }
    $('.event_list #selected_race').html(race_list);
    rider_results('senior');
});

$(document).ready(function(){
    
    $('#selected_race').change(function(){
      rider_results($(this).val());
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
function rider_results(rider_category){
    race_id = $('#selected_race').val();
    remote.getGlobal('sharedObj').race_id = race_id;
    remote.getGlobal('sharedObj').rider_category = rider_category;    
    riderdbInstance.findRiderByRace(race_id).then(rider => {
        senior_section = '';
        youth_section = '';
        junior_section = '';
        if(rider.length > 0){
            for(i = 0; i < rider.length; i ++){
                row = '<tr>';
                row += '<td>'+(rider[i].placing?rider[i].placing:'')+'</td>';
                row += '<td>'+rider[i].rider_number+'</td>';
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
    });
}