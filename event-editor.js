const {remote} = require('electron');

const eventdbInstance = remote.getGlobal('eventdb');
const racedbInstance = remote.getGlobal('racedb');
const riderdbInstance = remote.getGlobal('riderdb');
const tempRiderdbInstance = remote.getGlobal('tempRiderdb');
const tempHorsedbInstance = remote.getGlobal('tempHorsedb');
const event_id = remote.getGlobal('sharedObj').event_id;

eventdbInstance.read(event_id).then(event => {
    $('.event-header .event-details .name').html(event.name);
    $('.event-header .event-details .date').html(event.date);
    view_races();
});

$('#addRaceForm input[name="event_id"]').val(event_id);

$(document).ready(function(){
    
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

    riderdbInstance.findRiderByRace(race_id, search_value).then(rider => {
        console.log(rider);
        riders_section = '';
        results_section = '';
        for(i = 0; i < rider.length; i ++){
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
            riders_section += '<form action="#'+rider[i]._id+'" class="editRiderForm">';

            riders_section += '<div class="form-group col-xs-6">';
            riders_section += '    <label for="name">Rider Name</label>';
            riders_section += '    <input type="text" class="form-control" name="rider_name" placeholder="Rider Name" value="'+rider[i].rider_name+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-6">';
            riders_section += '    <label for="rider_id">Rider ID</label>';
            riders_section += '    <input type="number" class="form-control" name="rider_id" placeholder="ID" value="'+rider[i].rider_id+'">';
            riders_section += '</div>';
            riders_section += '<div class="form-group col-xs-6">';
            riders_section += '    <label for="horse_name">Horse Name</label>';
            riders_section += '    <input type="text" class="form-control" name="horse_name" placeholder="Horse Name" value="'+rider[i].horse_name+'">';
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

            results_section += '<div class="result-item result-item-'+rider[i]._id+'">';
            results_section += '<div class="item-detail">';
            results_section += '<div class="name col-xs-6">'+rider[i].rider_name+'</div>';
            results_section += '<div class="rider_id col-xs-3"><span>Rider ID: </span>'+rider[i].rider_id+'</div>';
            results_section += '<div class="rider_number col-xs-3"><span>Rider Number: </span>'+rider[i].rider_number+'</div>';
            
            results_section += '<div class="other finish-time col-xs-6">Finish Time: '+rider[i].finish_time+'</div>';
            results_section += '<div class="other soundness-score col-xs-6">Soundness Score: '+rider[i].soundness_score+'</div>';
            results_section += '<div class="other recovery-score col-xs-6">Recovery Score: '+rider[i].recovery_score+'</div>';
            results_section += '<div class="other quality_of_movement_score col-xs-6">Quality of Movement Score: '+rider[i].quality_of_movement_score+'</div>';
            results_section += '<div class="other hydration-score col-xs-6">Hydration Score: '+rider[i].hydration_score+'</div>';
            results_section += '<div class="other weight col-xs-6">Weight(in lbs): '+rider[i].weight+'</div>';
            results_section += '<div class="other lesions-score col-xs-6">Lesions Score: '+rider[i].lesions_score+'</div>';
            
            results_section += '</div>';
            results_section += '<div class="item-actions">';
            results_section += '<a href="javascript:edit_result('+"'"+rider[i]._id+"'"+');" class="btn btn-primary">Edit</a>';
            results_section += '</div>';
            results_section += '</div>';
            results_section += '<div class="edit-result-section edit-result-section-'+rider[i]._id+' col-xs-12">';
            results_section += '<form action="#'+rider[i]._id+'" class="editResultForm">';

            results_section += '<div class="form-group col-xs-6">';
            results_section += '    <label for="name">Pull Code</label>';
            results_section += '    <select name="pull_code" class="form-control" >';
            results_section += '        <option value="0">None</option>';
            results_section += '        <option value="1">Lame</option>';
            results_section += '        <option value="2">Metabolic</option>';
            results_section += '        <option value="3">Rider Option</option>';
            results_section += '        <option value="4">Time</option>';
            results_section += '    </select>';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6">';
            results_section += '    <label for="rider_id">Finish Time (Use Down Time)</label>';
            results_section += '    <input type="time" class="form-control" name="finish_time" placeholder="Finish Time" value="'+rider[i].finish_time+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6">';
            results_section += '    <label for="horse_name">Recovery Score</label>';
            results_section += '    <input type="number" class="form-control" name="recovery_score" placeholder="Recovery Score" value="'+rider[i].recovery_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6">';
            results_section += '    <label for="name">Hydration Score</label>';
            results_section += '    <input type="number" class="form-control" name="hydration_score" placeholder="Hydration Score" value="'+rider[i].hydration_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6">';
            results_section += '    <label for="name">Lesions Score</label>';
            results_section += '    <input type="number" class="form-control" name="lesions_score" placeholder="Lesions Score" value="'+rider[i].lesions_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6">';
            results_section += '    <label for="name">Soundness Score</label>';
            results_section += '    <input type="number" class="form-control" name="soundness_score" placeholder="Soundness Score" value="'+rider[i].soundness_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6">';
            results_section += '    <label for="name">Quality of Movement Score</label>';
            results_section += '    <input type="number" class="form-control" name="quality_of_movement_score" placeholder="Quality of Movement Score" value="'+rider[i].quality_of_movement_score+'">';
            results_section += '</div>';
            results_section += '<div class="form-group col-xs-6">';
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
        $('form.editRiderForm').each(function() {
            $(this).validate({
        
                rules: {
                    name: {
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
    
                    name: {
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
            race_list += '          <div class="form-group">';
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
        $('#addRace button.close').click();
    });
}

function addRider(){
    if(!$("#addRiderForm").valid())
        return;
    data = {
        rider_name: $('#addRiderForm input[name="rider_name"]').val(),
        rider_id: $('#addRiderForm input[name="rider_id"]').val(),
        horse_name: $('#addRiderForm input[name="horse_name"]').val(),
        horse_id: $('#addRiderForm input[name="horse_id"]').val(),
        amount_paid: $('#addRiderForm input[name="amount_paid"]').val(),
        payment_note: $('#addRiderForm input[name="payment_note"]').val(),
        payment_method: $('#addRiderForm select[name="payment_method"]').val(),
        category: $('#addRiderForm select[name="category"]').val(),
        rider_number: '',
        pull_code: '',
        finish_time: '',
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
    
    riderdbInstance.create(data).then(rider => {
        select_race($('#current_race_id').val());
        $('#addRider button.close').click();
    });
    tempRiderData = {
        name: $('#addRiderForm input[name="rider_name"]').val(),
        id: $('#addRiderForm input[name="rider_id"]').val()
    }

    tempRiderdbInstance.create(tempRiderData);

    tempHorseData = {
        name: $('#addRiderForm input[name="horse_name"]').val(),
        id: $('#addRiderForm input[name="horse_id"]').val()
    }

    tempHorsedbInstance.create(tempHorseData);
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
        rider_number: $(".edit-rider-section-"+id+" form input[name='rider_number']").val(),
        amount_paid: $(".edit-rider-section-"+id+" form input[name='amount_paid']").val(),
        payment_note: $(".edit-rider-section-"+id+" form input[name='payment_note']").val(),
        payment_method: $(".edit-rider-section-"+id+" form select[name='payment_method']").val(),
        category: $(".edit-rider-section-"+id+" form select[name='category']").val()
    }
    riderdbInstance.update(id, riderData).then(result => {
        select_race($('#current_race_id').val());
    })
}


function editRiderResult(id){
    data = {
        pull_code: $(".edit-result-section-"+id+" form select[name='pull_code']").val(),
        finish_time: $(".edit-result-section-"+id+" form input[name='finish_time']").val(),
        recovery_score: $(".edit-result-section-"+id+" form input[name='recovery_score']").val(),
        hydration_score: $(".edit-result-section-"+id+" form input[name='hydration_score']").val(),
        lesions_score: $(".edit-result-section-"+id+" form input[name='lesions_score']").val(),
        soundness_score: $(".edit-result-section-"+id+" form input[name='soundness_score']").val(),
        quality_of_movement_score: $(".edit-result-section-"+id+" form input[name='quality_of_movement_score']").val(),
        weight: $(".edit-result-section-"+id+" form input[name='weight']").val()
    };
    riderdbInstance.update(id, data).then(result => {
        $('.result-item-'+id+' .item-detail .finish-time').html('Finish Time: '+data.finish_time);
        $('.result-item-'+id+' .item-detail .soundness-score').html('Soundness Score: '+data.soundness_score);
        $('.result-item-'+id+' .item-detail .recovery-score').html('Recovery Score: '+data.recovery_score);
        $('.result-item-'+id+' .item-detail .quality_of_movement_score').html('Quality of Movement Score: '+data.quality_of_movement_score);
        $('.result-item-'+id+' .item-detail .hydration-score').html('Hydration Score: '+data.hydration_score);
        $('.result-item-'+id+' .item-detail .weight').html('Weight(in lbs): '+data.weight);
        $('.result-item-'+id+' .item-detail .lesions-score').html('Lesions Score: '+data.lesions_score);
        $('.edit-result-section-'+id).hide();
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