const {remote} = require('electron');

const eventdbInstance = remote.getGlobal('eventdb');
const racedbInstance = remote.getGlobal('racedb');
const riderdbInstance = remote.getGlobal('riderdb');
const tempRiderdbInstance = remote.getGlobal('tempRiderdb');
const tempHorsedbInstance = remote.getGlobal('tempHorsedb');
const event_id = remote.getGlobal('sharedObj').event_id;
var rider_name_list = [];
var rider_id_list = [];
var horse_name_list = [];
var horse_id_list = [];

function init_temp_rider_data(){
    rider_name_list = [];
    rider_id_list = [];
    tempRiderdbInstance.readAll().then(riders => {
        for(i = 0; i < riders.length; i ++){
            rider_name_list.push(riders[i].name);
            rider_id_list.push(riders[i].id);
        }
    });
}

function init_temp_horse_data(){
    horse_name_list = [];
    horse_id_list = [];
    tempHorsedbInstance.readAll().then(horses => {
        for(i = 0; i < horses.length; i ++){
            horse_name_list.push(horses[i].name);
            horse_id_list.push(horses[i].id);
        }
    });
}

eventdbInstance.read(event_id).then(event => {
    $('.event-header .event-details .name').html(event.name);
    $('.event-header .event-details .date').html(event.date);
    view_races();
});

$('#addRaceForm input[name="event_id"]').val(event_id);

$(document).ready(function(){
    init_temp_rider_data();
    init_temp_horse_data();
    race_id = 0;
    $('.race-item-'+race_id).click();
    
    $("#addRaceForm").validate({
 
        rules: {
            distance: {
                required: true,
                maxlength: 50
            },

            start_time: {
                required: true,
            },
            
            start_number: {
                required: true,
            },
            
            hold_time: {
                required: true,
            },

        },
        messages: {

            distance: {
                required: "Please enter distance",
            },
            start_time: {
                required: "Please enter start time",
            },
            start_number: {
                required: "Please enter start number",
            },
            hold_time: {
                required: "Please enter hold time",
            },

        },
    });
    
    $("#addRiderForm").validate({
 
        rules: {
            rider_name: {
                required: true,
                maxlength: 50
            },
            
            rider_id: {
                required: true,
            },
            
            horse_name: {
                required: true,
                maxlength: 50
            },
            
            horse_id: {
                required: true,
            },

            amount_paid: {
                required: true,
            },
            
            payment_note: {
                required: true,
            },
            
            payment_method: {
                required: true,
            },
            
            category: {
                required: true,
            },

        },
        messages: {

            rider_name: {
                required: "Please enter rider name",
            },
            
            rider_id: {
                required: "Please enter rider id",
            },
            
            horse_name: {
                required: "Please enter horse name",
            },
            
            horse_id: {
                required: "Please enter horse id",
            },
            
            amount_paid: {
                required: "Please enter amount paid",
            },
            
            payment_note: {
                required: "Please enter payment note",
            },
            
            payment_method: {
                required: "Please select payment method",
            },
            
            category: {
                required: "Please enter category",
            },

        },
    });
    
    $('#txtSearch').on("input", function(){
        search_rider();
    });

    autocomplete(document.getElementById("create_rider_name"), rider_name_list, "rider");
    autocomplete(document.getElementById("create_horse_name"), horse_name_list, "horse");

    $('#addRiderForm input[name="rider_name"]').on("input", function(){
        $('#addRiderForm .auto-complete-rider .autocomplete-items div').click(function(){
            $('#addRiderForm input[name="rider_id"]').val($(this).attr("data-id"));
        });
    });

    $('#addRiderForm input[name="horse_name"]').on("input", function(){
        $('#addRiderForm .auto-complete-horse .autocomplete-items div').click(function(){
            $('#addRiderForm input[name="horse_id"]').val($(this).attr("data-id"));
        });
    });    
});
function select_race(race_id, search_value = ""){
    $('.riders_results-section ul.nav.nav-tabs li:first-child').click();
    $('#current_race_id').val(race_id);
    payment_method = [
        'cash',
        'check'
    ];
        
    rider_category = [
        'senior',
        'youth',
        'junior'
    ];

    pull_code = [
        'None',
        'Lame',
        'Metabolic',
        'Rider Option',
        'Time'
    ];

    riderdbInstance.findRider(race_id, search_value).then(rider => {
        riders_section = '';
        results_section = '';
        for(var i = 0; i < rider.length; i ++){
            riders_section += '<div class="rider-item rider-item-'+rider[i]._id+'">';
            riders_section += '<div class="item-detail">';
            riders_section += '<div class="name col-xs-6">'+rider[i].rider_name+'</div>';
            riders_section += '<div class="rider_id col-xs-3"><span>Rider ID: </span>'+rider[i].rider_id+'</div>';
            riders_section += '<div class="rider_number col-xs-3"><span>Rider Number: </span>'+rider[i].rider_number+'</div>';

            riders_section += '<div class="other horse-name col-xs-6">Horse Name: '+rider[i].horse_name+'</div>';
            riders_section += '<div class="other amount-paid col-xs-6">Amount Paid: $'+rider[i].amount_paid+'</div>';
            riders_section += '<div class="other horse-id col-xs-6">Horse ID: '+rider[i].horse_id+'</div>';
            riders_section += '<div class="other payment-note col-xs-6">Payment Note: '+rider[i].payment_note+'</div>';
            riders_section += '<div class="other category col-xs-6">Category: '+rider[i].category+'</div>';
            riders_section += '<div class="other payment-method col-xs-6">Payment Methods: '+rider[i].payment_method+'</div>';

            riders_section += '</div>';
            riders_section += '<div class="item-actions">';
            riders_section += '<a href="javascript:edit_rider('+"'"+rider[i]._id+"'"+');" class="btn btn-primary">Edit</a>';
            riders_section += '<a href="javascript:delete_rider('+"'"+rider[i]._id+"'"+');" class="btn btn-primary">Delete</a>';
            riders_section += '</div>';
            riders_section += '</div>';
            riders_section += '<div class="edit-rider-section edit-rider-section-'+rider[i]._id+' col-xs-12">';
            riders_section += '<form action="#'+rider[i]._id+'" class="editRiderForm editRiderForm_'+rider[i]._id+'">';

            riders_section += '<div class="form-group col-xs-6 auto-complete-rider">';
            riders_section += '    <label for="name">Rider Name</label>';
            riders_section += '    <input type="text" class="form-control" name="rider_name" placeholder="Rider Name" value="'+rider[i].rider_name+'" id="update_rider_name_'+rider[i]._id+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-6">';
            riders_section += '    <label for="rider_id">Rider ID</label>';
            riders_section += '    <input type="number" class="form-control" name="rider_id" placeholder="ID" value="'+rider[i].rider_id+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-6 auto-complete-horse">';
            riders_section += '    <label for="horse_name">Horse Name</label>';
            riders_section += '    <input type="text" class="form-control" name="horse_name" placeholder="Horse Name" value="'+rider[i].horse_name+'" id="update_horse_name_'+rider[i]._id+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-6">';
            riders_section += '    <label for="name">Horse ID</label>';
            riders_section += '    <input type="text" class="form-control" name="horse_id" placeholder="Horse ID" value="'+rider[i].horse_id+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-6">';
            riders_section += '    <label for="name">Rider Number</label>';
            riders_section += '    <input type="number" class="form-control" name="rider_number" placeholder="Rider Number" value="'+rider[i].rider_number+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-6">';
            riders_section += '    <label for="name">Amount Paid</label>';
            riders_section += '    <input type="number" class="form-control" name="amount_paid" placeholder="Amount Paid" value="'+rider[i].amount_paid+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-12">';
            riders_section += '    <label for="name">Payment Note</label>';
            riders_section += '    <input type="text" class="form-control" name="payment_note" placeholder="Payment Note" value="'+rider[i].payment_note+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-12">';
            riders_section += '    <label for="name">Payment Method</label>';
            riders_section += '    <select name="payment_method" class="form-control" >';
            for(index = 0; index < 2; index ++)
                if(payment_method[index] == rider[i].payment_method)
                    riders_section += '<option value="'+payment_method[index]+'" selected>'+rider[i].payment_method+'</option>';
                else
                    riders_section += '<option value="'+payment_method[index]+'">'+payment_method[index]+'</option>';
            riders_section += '    </select>';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-12">';
            riders_section += '    <label for="name">Category</label>';
            riders_section += '    <select name="category" class="form-control" >';
            for(index = 0; index < 3; index ++)
                if(rider_category[index] == rider[i].category)
                    riders_section += '<option value="'+rider_category[index]+'" selected>'+rider[i].category+'</option>';
                else
                    riders_section += '<option value="'+rider_category[index]+'">'+rider_category[index]+'</option>';
            riders_section += '    </select>';
            riders_section += '</div>';

            riders_section += '<div class="form-group col-xs-12">';
            riders_section += '    <a href="javascript:editRider('+"'"+rider[i]._id+"'"+');" type="button" class="btn btn-primary">Save</a>';
            riders_section += '</div>';

            riders_section += '</form>';
            riders_section += '</div>'; 
            riders_section += '<div class="delete-rider-section delete-rider-section-'+rider[i]._id+' col-xs-12">';
            riders_section += '<h3>Are you sure you want to delete this rider?</h3>';
            riders_section += '<p>This cannot be undone.</p>';
            riders_section += '<div class="action">';
            riders_section += '<a href="javascript:cancel_delete_rider('+"'"+rider[i]._id+"'"+');" class="btn btn-default cancel-delete-section">cancel</a>';
            riders_section += '<a href="javascript:deleteRider('+"'"+rider[i]._id+"'"+');" class="btn btn-warning delete-delete-section">Delete</a>';
            riders_section += '</div>';
            riders_section += '</div>';

        //  results-section

            results_section += '<div class="result-item result-item-'+rider[i]._id;
            if(rider[i].pull_code != "None")
            results_section += ' pull_code_exist';
            results_section += '">';
            //////////////////////////////////////////////////////////////////////
            results_section += '<div class="item-detail">';
            results_section += '<div class="name col-xs-6">'+rider[i].rider_name+'</div>';
            results_section += '<div class="rider_id col-xs-3"><span>Rider ID: </span>'+rider[i].rider_id+'</div>';
            results_section += '<div class="rider_number col-xs-3"><span>Rider Number: </span>'+rider[i].rider_number+'</div>';
            
            // if(rider[i].pull_code != "None" ){
                results_section += '<div class="other pull-code col-xs-12">Pull Code: '+rider[i].pull_code+'</div>';
            // }
            // else{
                results_section += '<div class="other finish-time col-xs-6">Finish Time: '+rider[i].finish_time+'</div>';
                results_section += '<div class="other soundness-score col-xs-6">Soundness Score: '+rider[i].soundness_score+'</div>';
                results_section += '<div class="other recovery-score col-xs-6">Recovery Score: '+rider[i].recovery_score+'</div>';
                results_section += '<div class="other quality_of_movement_score col-xs-6">Quality of Movement Score: '+rider[i].quality_of_movement_score+'</div>';
                results_section += '<div class="other hydration-score col-xs-6">Hydration Score: '+rider[i].hydration_score+'</div>';
                results_section += '<div class="other weight col-xs-6">Weight(in lbs): '+rider[i].weight+'</div>';
                results_section += '<div class="other lesions-score col-xs-6">Lesions Score: '+rider[i].lesions_score+'</div>';
            // }
            results_section += '</div>';
            //////////////////////////////////////////////////////////////////////
            results_section += '<div class="item-actions">';
            results_section += '<a href="javascript:edit_result('+"'"+rider[i]._id+"'"+');" class="btn btn-primary">Edit</a>';
            results_section += '</div>';
            results_section += '</div>';
            results_section += '<div class="edit-result-section edit-result-section-'+rider[i]._id+' col-xs-12">';
            results_section += '<form action="#'+rider[i]._id+'" class="editResultForm ';
            if(rider[i].pull_code != "None")
            results_section += 'pull_code_exist';
            results_section += '">';

            results_section += '<div class="form-group col-xs-6">';
            results_section += '    <label for="name">Pull Code</label>';
            results_section += '    <select name="pull_code" class="form-control" onchange="selected_pull_code($(this).val(), '+"'"+rider[i]._id+"'"+')">';

            for(index = 0; index < 5; index ++)
                if(pull_code[index] == rider[i].pull_code)
                    results_section += '<option value="'+pull_code[index]+'" selected>'+rider[i].pull_code+'</option>';
                else
                    results_section += '<option value="'+pull_code[index]+'">'+pull_code[index]+'</option>';
            results_section += '    </select>';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6 other">';
            results_section += '    <label for="rider_id">Finish Time</label>';
            results_section += '    <input type="time" class="form-control" name="finish_time" placeholder="Finish Time" value="'+rider[i].finish_time+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6 other">';
            results_section += '    <label for="horse_name">Recovery Score</label>';
            results_section += '    <input type="number" class="form-control" name="recovery_score" placeholder="Recovery Score" value="'+rider[i].recovery_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6 other">';
            results_section += '    <label for="name">Hydration Score</label>';
            results_section += '    <input type="number" class="form-control" name="hydration_score" placeholder="Hydration Score" value="'+rider[i].hydration_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6 other">';
            results_section += '    <label for="name">Lesions Score</label>';
            results_section += '    <input type="number" class="form-control" name="lesions_score" placeholder="Lesions Score" value="'+rider[i].lesions_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6 other">';
            results_section += '    <label for="name">Soundness Score</label>';
            results_section += '    <input type="number" class="form-control" name="soundness_score" placeholder="Soundness Score" value="'+rider[i].soundness_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6 other">';
            results_section += '    <label for="name">Quality of Movement Score</label>';
            results_section += '    <input type="number" class="form-control" name="quality_of_movement_score" placeholder="Quality of Movement Score" value="'+rider[i].quality_of_movement_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6 other">';
            results_section += '    <label for="name">Weight</label>';
            results_section += '    <input type="number" class="form-control" name="weight" placeholder="Weight" value="'+rider[i].weight+'">';
            results_section += '</div>';

            results_section += '<div class="form-group col-xs-12">';
            results_section += '    <a href="javascript:editRiderResult('+"'"+rider[i]._id+"'"+');" type="button" class="btn btn-primary">Save</a>';
            results_section += '</div>';

            results_section += '</form>';
            results_section += '</div>';
            
        }
        $('#riders.tab-pane .list').html(riders_section);
        $('#results.tab-pane .list').html(results_section);
        $('.pull_code_exist .other').hide();
        $('.pull_code_exist .pull-code').show();
        $('form.editRiderForm').each(function() {
            $(this).validate({
        
                rules: {
                    rider_name: {
                        required: true,
                        maxlength: 50
                    },
    
                    rider_id: {
                        required: true,
                    },
                    
                    horse_name: {
                        required: true,
                        maxlength: 50
                    },
                    
                    horse_id: {
                        required: true,
                    },

                    rider_number: {
                        required: true,
                    },
                    
                    amount_paid: {
                        required: true,
                    },
                    
                    payment_note: {
                        required: true,
                    },
                            
                },
                messages: {
    
                    rider_name: {
                        required: "Please enter rider name",
                    },
                    rider_id: {
                        required: "Please enter rider id",
                    },
                    horse_name: {
                        required: "Please enter horse name",
                    },
                    horse_id: {
                        required: "Please enter horse id",
                    },
                    rider_number: {
                        required: "Please enter rider number",
                    },
                    amount_paid: {
                        required: "Please enter amount paid",
                    },
                    payment_note: {
                        required: "Please enter payment note",
                    },
    
                },
            });
        });
        rider.forEach(item => {
            autocomplete(document.getElementById("update_rider_name_"+item._id), rider_name_list, "rider");
            autocomplete(document.getElementById("update_horse_name_"+item._id), horse_name_list, "horse");
            $('.editRiderForm_'+item._id+' input[name="rider_name"]').on("input", function(){
                $('.editRiderForm_'+item._id+' .auto-complete-rider .autocomplete-items div').click(function(){
                    $('.editRiderForm_'+item._id+' input[name="rider_id"]').val($(this).attr("data-id"));
                });
            });

            $('.editRiderForm_'+item._id+' input[name="horse_name"]').on("input", function(){
                $('.editRiderForm_'+item._id+' .auto-complete-horse .autocomplete-items div').click(function(){
                    $('.editRiderForm_'+item._id+' input[name="horse_id"]').val($(this).attr("data-id"));
                });
            });
        });
    });
}
function edit_race(id){
    $('.edit-race-section-'+id).toggle();
}
function delete_race(id){
    $('.delete-race-section-'+id).toggle();
}
function cancel_delete_race(id){
    $('.delete-race-section-'+id).hide();
}

function edit_rider(id){
    $('.edit-rider-section-'+id).toggle();
}
function delete_rider(id){
    $('.delete-rider-section-'+id).toggle();
}
function cancel_delete_rider(id){
    $('.delete-rider-section-'+id).hide();
}

function edit_result(id){
    $('.edit-result-section-'+id).toggle();
}

function view_races(){
    racedbInstance.findRaceByEvent(event_id).then(race => {
        race_list = '';
        for(i = 0; i < race.length; i ++){
            race_list += '<div class="race-item race-item-'+race[i]._id+'" onclick="select_race('+"'"+race[i]._id+"'"+')">';
            race_list += '    <div class="item-detail">';
            race_list += '        <div class="name col-xs-6">'+race[i].distance+' miles</div>';
            race_list += '        <div class="other col-xs-6">';
            race_list += '            <div class="start_time">Start time: '+race[i].start_time+'</div>';
            race_list += '            <div class="start_number">Start number: '+race[i].start_number+'</div>';
            race_list += '            <div class="hold_time">Hold time: '+race[i].hold_time+'</div>';
            race_list += '        </div>';
            race_list += '    </div>';
            race_list += '    <div class="item-actions">';
            race_list += '        <a href="javascript:edit_race('+"'"+race[i]._id+"'"+');" class="btn btn-primary">Edit</a>';
            race_list += '        <a href="javascript:delete_race('+"'"+race[i]._id+"'"+');" class="btn btn-primary">Delete</a>';
            race_list += '    </div>';
            race_list += '</div>';
            race_list += '<div class="edit-race-section edit-race-section-'+race[i]._id+'">';
            race_list += '    <form action="#'+race[i]._id+'" class="editRaceForm">';
            race_list += '          <div class="form-group col-xs-6">';
            race_list += '            <label for="name">Distance</label>';
            race_list += '            <input type="number" class="form-control" name="distance" placeholder="Distance" value="'+race[i].distance+'">';
            race_list += '          </div>';
            race_list += '          <div class="form-group col-xs-6">';
            race_list += '            <label for="date">Start Time</label>';
            race_list += '            <input type="time" class="form-control" name="start_time" placeholder="Start Time" value="'+race[i].start_time+'">';
            race_list += '          </div>';
            race_list += '          <div class="form-group col-xs-6">';
            race_list += '            <label for="date">Start Number</label>';
            race_list += '            <input type="number" class="form-control" name="start_number" placeholder="Start Number" value="'+race[i].start_number+'">';
            race_list += '          </div>';
            race_list += '          <div class="form-group col-xs-6">';
            race_list += '            <label for="date">Hold Time (In minutes)</label>';
            race_list += '            <input type="number" class="form-control" name="hold_time" placeholder="Hold Time" value="'+race[i].hold_time+'">';
            race_list += '          </div>';
            race_list += '          <div class="form-group col-xs-12">';
            race_list += '            <a href="javascript:editRace('+"'"+race[i]._id+"'"+');" type="button" class="btn btn-primary" data-dismiss="modal">Save</a>';
            race_list += '          </div>';
            race_list += '  </form>';
            race_list += '</div>';
            race_list += '<div class="delete-race-section delete-race-section-'+race[i]._id+'">';
            race_list += '    <h3>Are you sure you want to delete this race?</h3>';
            race_list += '    <p>This cannot be undone.</p>';
            race_list += '    <div class="action">';
            race_list += '        <a href="javascript:cancel_delete_race('+"'"+race[i]._id+"'"+');" class="btn btn-default cancel-delete-section">cancel</a>';
            race_list += '        <a href="javascript:deleteRace('+"'"+race[i]._id+"'"+');" class="btn btn-warning delete-delete-section">Delete</a>';
            race_list += '    </div>';
            race_list += '</div>';
        }
        if(race_list == '')
            race_list = '<div class="race-item">There is no data.</div>';
        $('.event-section.races #home .list').html(race_list);
        
        $('form.editRaceForm').each(function() {
            $(this).validate({
        
                rules: {
                    distance: {
                        required: true,
                        maxlength: 50
                    },
    
                    start_time: {
                        required: true,
                    },
                    
                    start_number: {
                        required: true,
                    },
                    
                    hold_time: {
                        required: true,
                    },
    
                },
                messages: {
    
                    distance: {
                        required: "Please enter distance",
                    },
                    start_time: {
                        required: "Please enter start time",
                    },
                    start_number: {
                        required: "Please enter start number",
                    },
                    hold_time: {
                        required: "Please enter hold time",
                    },
    
                },
            });
        });

        $('.race-item').click(function(){
            $('.race-item').removeClass('active');
            $('.race-item').find('.btn').removeClass('btn-default');
            $('.race-item').find('.btn').addClass('btn-primary');
            $(this).addClass('active');
            $(this).find('.btn').removeClass('btn-primary');
            $(this).find('.btn').addClass('btn-default');
        });
        if(race.length > 0)
            $('.race-item-'+ race[0]._id).click();
    });
}

function addRace(){
    if(!$("#addRaceForm").valid())
        return;
    data = {
        distance: $("#addRaceForm input[name='distance']").val(),
        start_time: $("#addRaceForm input[name='start_time']").val(),
        start_number: $("#addRaceForm input[name='start_number']").val(),
        hold_time: $("#addRaceForm input[name='hold_time']").val(),
        event_id: event_id
    };
    racedbInstance.create(data).then(race => {
        view_races();
        $("#addRaceForm")[0].reset();
        $('#addRace button.close').click();
    });
}

function addRider(){
    if(!$("#addRiderForm").valid())
        return;
    racedbInstance.read($('#current_race_id').val()).then(race => {
        start_time = race.start_time;
        hold_time = race.hold_time;
        // finish_time = 0;
        // ride_time = format_time_to_display(finish_time - time_to_minutes(start_time) - parseInt(hold_time));
        // console.log('time_to_minutes(start_time): '+time_to_minutes(start_time));
        // console.log('hold_time: '+hold_time);
        // console.log('finish_time: '+finish_time);
        // console.log('ride_time: '+ride_time);
        data = {
            rider_name: $('#addRiderForm input[name="rider_name"]').val(),
            rider_id: $('#addRiderForm input[name="rider_id"]').val(),
            horse_name: $('#addRiderForm input[name="horse_name"]').val(),
            horse_id: $('#addRiderForm input[name="horse_id"]').val(),
            amount_paid: $('#addRiderForm input[name="amount_paid"]').val(),
            payment_note: $('#addRiderForm input[name="payment_note"]').val(),
            payment_method: $('#addRiderForm select[name="payment_method"]').val(),
            category: $('#addRiderForm select[name="category"]').val(),
            rider_number: 0,
            pull_code: 'None',
            finish_time: '00:00',
            recovery_score: '',
            hydration_score: '',
            lesions_score: '',
            soundness_score: '',
            quality_of_movement_score: '',
            weight: '',
            rideTime: '',
            placing: '',
            bcScore: '',
            ridePoints: '',
            bcPoints: '',
            bcPlacing: '',
            vetScore: '',
            race_id: $('#current_race_id').val()
        };
        riderdbInstance.getMaxRiderNumber($('#current_race_id').val()).then(rider => {
            console.log(rider);
            if(rider.length > 0){
                console.log('max');
                console.log(rider[0].rider_number);
                data.rider_number = parseInt(rider[0].rider_number) + 1;
                riderdbInstance.create(data).then(rider => {
                    select_race($('#current_race_id').val());
                    $('#addRiderForm')[0].reset();
                    $('#addRider button.close').click();
                });
            }
            else{
                console.log('start_number');
                racedbInstance.read($('#current_race_id').val()).then(race => {
                    console.log(race);
                    start_number = race.start_number;
                    console.log(start_number);
                    data.rider_number = parseInt(start_number);
                    riderdbInstance.create(data).then(rider => {
                        select_race($('#current_race_id').val());
                        $('#addRiderForm')[0].reset();
                        $('#addRider button.close').click();
                    });
                });
            }
            tempRiderData = {
                name: $('#addRiderForm input[name="rider_name"]').val(),
                id: $('#addRiderForm input[name="rider_id"]').val()
            }
        
            tempRiderdbInstance.exist(tempRiderData).then(rider => {
                if(!rider)
                    tempRiderdbInstance.create(tempRiderData);
                // init_temp_rider_data();
                rider_name_list.push(tempRiderData.name);
                rider_id_list.push(tempRiderData.id);
            });
        
            tempHorseData = {
                name: $('#addRiderForm input[name="horse_name"]').val(),
                id: $('#addRiderForm input[name="horse_id"]').val()
            }
        
            tempHorsedbInstance.exist(tempHorseData).then(horse => {
                if(!horse)
                    tempHorsedbInstance.create(tempHorseData);
                // init_temp_horse_data();
                horse_name_list.push(tempHorseData.name);
                horse_id_list.push(tempHorseData.id);
            });
        });
    });
}

function editRace(id){
    console.log($(".edit-race-section-"+id));
    if(!$(".edit-race-section-"+id+" form").valid())
        return;
    
    race_data = {
        distance: $(".edit-race-section-"+id+" input[name='distance']").val(),
        start_time: $(".edit-race-section-"+id+" input[name='start_time']").val(),
        start_number: $(".edit-race-section-"+id+" input[name='start_number']").val(),
        hold_time: $(".edit-race-section-"+id+" input[name='hold_time']").val()
    }
    racedbInstance.update(id, race_data).then(race => {
        $('.race-item-'+id+' .item-detail .name').html(race_data.distance+' miles');
        $('.race-item-'+id+' .item-detail .start_time').html('Start time: '+race_data.start_time);
        $('.race-item-'+id+' .item-detail .start_number').html('Start number: '+race_data.start_number);
        $('.race-item-'+id+' .item-detail .hold_time').html('Hold time: '+race_data.hold_time);
        $('.edit-race-section-'+id).hide();
        riderdbInstance.findRiderByRace(id).then(rider => {
            rider.forEach(item => {
                start_time = race_data.start_time;
                hold_time = race_data.hold_time;
                finish_time = item.finish_time;
                finish_time = (finish_time != '' && finish_time != 0)?finish_time:"00:00";
                ride_time = format_time_to_display(time_to_minutes(finish_time) - time_to_minutes(start_time) - parseInt(hold_time));
                riderdbInstance.update(item._id, {rideTime: ride_time});
            });
        });
    });
}

function editRider(id){
    if(!$(".edit-rider-section-"+id+" form").valid())
        return;
    riderData = {
        rider_name: $(".edit-rider-section-"+id+" form input[name='rider_name']").val(),
        rider_id: $(".edit-rider-section-"+id+" form input[name='rider_id']").val(),
        horse_name: $(".edit-rider-section-"+id+" form input[name='horse_name']").val(),
        horse_id: $(".edit-rider-section-"+id+" form input[name='horse_id']").val(),
        rider_number: parseInt($(".edit-rider-section-"+id+" form input[name='rider_number']").val()),
        amount_paid: $(".edit-rider-section-"+id+" form input[name='amount_paid']").val(),
        payment_note: $(".edit-rider-section-"+id+" form input[name='payment_note']").val(),
        payment_method: $(".edit-rider-section-"+id+" form select[name='payment_method']").val(),
        category: $(".edit-rider-section-"+id+" form select[name='category']").val()
    }
    riderdbInstance.update(id, riderData).then(result => {
        select_race($('#current_race_id').val());
        tempRiderData = {
            name: $('#addRiderForm input[name="rider_name"]').val(),
            id: $('#addRiderForm input[name="rider_id"]').val()
        }
    
        tempRiderdbInstance.exist(tempRiderData).then(rider => {
            if(!rider)
                tempRiderdbInstance.create(tempRiderData);
            // init_temp_rider_data();
            rider_name_list.push(tempRiderData.name);
            rider_id_list.push(tempRiderData.id);
        });
    
        tempHorseData = {
            name: $('#addRiderForm input[name="horse_name"]').val(),
            id: $('#addRiderForm input[name="horse_id"]').val()
        }
    
        tempHorsedbInstance.exist(tempHorseData).then(horse => {
            if(!horse)
                tempHorsedbInstance.create(tempHorseData);
            // init_temp_horse_data();
            horse_name_list.push(tempHorseData.name);
            horse_id_list.push(tempHorseData.id);
        });
    })
}

function editRiderResult(id){
    racedbInstance.read($('#current_race_id').val()).then(race => {
        start_time = race.start_time;
        hold_time = race.hold_time;
        finish_time = $(".edit-result-section-"+id+" form input[name='finish_time']").val();
        finish_time = (finish_time != '')?finish_time:"00:00";
        if(finish_time == "00:00")
            ride_time = ''
        else
            ride_time = format_time_to_display(time_to_minutes(finish_time) - time_to_minutes(start_time) - parseInt(hold_time));
        // console.log('start_time: '+start_time);
        // console.log('hold_time: '+hold_time);
        // console.log('finish_time: '+finish_time);
        // console.log('ride_time: '+ride_time);
        pull_code = $(".edit-result-section-"+id+" form select[name='pull_code']").val();
        if(pull_code == 'None')
            data = {
                pull_code: pull_code,
                finish_time: $(".edit-result-section-"+id+" form input[name='finish_time']").val(),
                recovery_score: $(".edit-result-section-"+id+" form input[name='recovery_score']").val(),
                hydration_score: $(".edit-result-section-"+id+" form input[name='hydration_score']").val(),
                lesions_score: $(".edit-result-section-"+id+" form input[name='lesions_score']").val(),
                soundness_score: $(".edit-result-section-"+id+" form input[name='soundness_score']").val(),
                quality_of_movement_score: $(".edit-result-section-"+id+" form input[name='quality_of_movement_score']").val(),
                weight: $(".edit-result-section-"+id+" form input[name='weight']").val(),
                rideTime: ride_time
            };
        else
            data = {
                pull_code: pull_code,
                finish_time: '00:00',
                recovery_score: '',
                hydration_score: '',
                lesions_score: '',
                soundness_score: '',
                quality_of_movement_score: '',
                weight: '',
                rideTime: '',
                placing:'',
                bcScore:'',
                ridePoints: '',
                bcPoints: '',
                bcPlacing: '',
                vetScore: ''
            };
        riderdbInstance.update(id, data).then(result => {
            $('.result-item-'+id+' .item-detail .finish-time').html('Finish Time: '+data.finish_time);
            $('.result-item-'+id+' .item-detail .soundness-score').html('Soundness Score: '+data.soundness_score);
            $('.result-item-'+id+' .item-detail .recovery-score').html('Recovery Score: '+data.recovery_score);
            $('.result-item-'+id+' .item-detail .quality_of_movement_score').html('Quality of Movement Score: '+data.quality_of_movement_score);
            $('.result-item-'+id+' .item-detail .hydration-score').html('Hydration Score: '+data.hydration_score);
            $('.result-item-'+id+' .item-detail .weight').html('Weight(in lbs): '+data.weight);
            $('.result-item-'+id+' .item-detail .lesions-score').html('Lesions Score: '+data.lesions_score);
            $('.result-item-'+id+' .item-detail .pull-code').html('Pull Code: '+data.pull_code);
            $('.edit-result-section-'+id).hide();
            if(pull_code == 'None'){
                $('.edit-result-section-'+id+' .other').show();
                $('.result-item-'+id+' .other').show();
                $('.result-item-'+id+' .pull-code').hide();
            }
            else{
                $('.edit-result-section-'+id+' .other').hide();
                $('.result-item-'+id+' .other').hide();
                $('.result-item-'+id+' .pull-code').show();
            }
        });
    });
}

function deleteRace(id){
    racedbInstance.delete(id).then(result => {
        $('.race-item-'+id).remove();
        $('.edit-race-section-'+id).remove();
        $('.delete-race-section-'+id).remove();
    });
}

function deleteRider(id){
    riderdbInstance.delete(id).then(result => {
        select_race($('#current_race_id').val());
    });
}

function search_rider(){
    race_id = $('#current_race_id').val();
    search_value = $('#txtSearch').val();
    select_race(race_id, search_value);
}



function autocomplete(inp, arr, type) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            if(type == "rider"){
                b.setAttribute("data-id", rider_id_list[i]);
            }
            else if(type == "horse"){
                b.setAttribute("data-id", horse_id_list[i]);
            }
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }


function time_to_minutes(time){
    total_minute = 0;
    parse_time = time.split(':');
    total_minute = parseInt(parse_time[0]*60) + parseInt(parse_time[1]);
    return total_minute;
}

function format_time_to_display(total_minute){
    format_time = '';
    if(Math.abs(total_minute) > 60)
        format_time += parseInt(Math.abs(total_minute) / 60) + ' h ';
    if(total_minute % 60 != 0)
        format_time += (Math.abs(total_minute) % 60) + ' m';
    if(format_time == '')
        format_time += '0 minute';
    if(total_minute < 0)
        format_time = '-'+format_time;
    return format_time;
}

function selected_pull_code(pull_code, rider_id){
    if(pull_code != 'None'){
        $('.edit-result-section-'+rider_id+' .other').hide();
    }
    else{
        $('.edit-result-section-'+rider_id+' .other').show();
    }
}