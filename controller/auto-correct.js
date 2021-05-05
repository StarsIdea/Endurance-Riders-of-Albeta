const {remote} = require('electron');

// const eventdbInstance = remote.getGlobal('eventdb');
// const racedbInstance = remote.getGlobal('racedb');
// const riderdbInstance = remote.getGlobal('riderdb');
// const event_id = remote.getGlobal('sharedObj').event_id;

const tempRiderdbInstance = remote.getGlobal('tempRiderdb');
const tempHorsedbInstance = remote.getGlobal('tempHorsedb');

$(document).ready(function(){
    search_rider();
    search_horse();
    $('#search_rider').on("input", function(){
        search_value = $('#search_rider').val();
        search_rider(search_value);
    });
    $('#search_horse').on("input", function(){
        search_value = $('#search_horse').val();
        search_horse(search_value);
    });
});

function search_rider(search_value = ''){
    tempRiderdbInstance.find(search_value).then(riders => {
        rider_list = '';
        for(i = 0; i < riders.length; i ++){
            rider_list += '<li class="rider-item-'+riders[i]._id+'">';
            rider_list += '    <a href="javascript:delete_auto_complete_rider('+"'"+riders[i]._id+"'"+')" class="btn btn-danger">Delete</a>';
            rider_list += '    <div class="item-content">';
            rider_list += '        <div class="name">';
            rider_list += riders[i].name;
            rider_list += '        </div>';
            rider_list += '        <div class="rider_id">';
            rider_list += riders[i].id;
            rider_list += '        </div>';
            rider_list += '    </div>';
            rider_list += '</li>';
        }
        if(rider_list == '')
            rider_list = '<li>There is no data.</li>';

        $('.rider-list').html(rider_list);
    }); 
}

function search_horse(search_value = ''){
    tempHorsedbInstance.find(search_value).then(horses => {
        horse_list = '';
        for(i = 0; i < horses.length; i ++){
            horse_list += '<li class="horse-item-'+horses[i]._id+'">';
            horse_list += '    <a href="javascript:delete_auto_complete_horse('+"'"+horses[i]._id+"'"+')" class="btn btn-danger">Delete</a>';
            horse_list += '    <div class="item-content">';
            horse_list += '        <div class="name">';
            horse_list += horses[i].name;
            horse_list += '        </div>';
            horse_list += '        <div class="rider_id">';
            horse_list += horses[i].id;
            horse_list += '        </div>';
            horse_list += '    </div>';
            horse_list += '</li>';
        }
        if(horse_list == '')
            horse_list = '<li>There is no data.</li>';

        $('.horse-list').html(horse_list);
    });
}
function delete_auto_complete_rider(id){
    tempRiderdbInstance.delete(id).then(result =>{
        search_rider();
    });
}
function delete_auto_complete_horse(id){
    tempHorsedbInstance.delete(id).then(result =>{
        search_horse();
    });
}