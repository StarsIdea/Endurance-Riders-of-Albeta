const {remote} = require('electron');
const eventdbInstance = remote.getGlobal('eventdb');
const event_id = remote.getGlobal('sharedObj').event_id;

console.log(event_id);

eventdbInstance.read(event_id).then(event => {
    $('.event-header .event-details .name').html(event.name);
    $('.event-header .event-details .date').html(event.date);
    view_races();
});

$('#addRaceForm input[name="event_id"]').val(event_id);

$(document).ready(function(){
    
    race_id = 0;
    // <?php if(count($races)>0){?>
    //     race_id = <?php echo $races[0]->id;?>;
    // <?php }?>
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

            amount_paid: {
                required: true,
            },
            
            payment_note: {
                required: true,
            },
            
            payment_method: {
                required: true,
            },
            
            hold_time: {
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
            
            amount_paid: {
                required: "Please enter amount paid",
            },
            
            payment_note: {
                required: "Please enter payment note",
            },
            
            payment_method: {
                required: "Please select payment method",
            },
            
            hold_time: {
                required: "Please enter hold time",
            },

        },
    });
    
    $('#txtSearch').on("input", function(){
        search_rider();
    });
    // $(".editRaceForm").submit(function(){
        // console.log($(this));
        // console.log($(this).valid());
    // });
    
    // $('.btn-submit').click(function(){
    //     $(this).parents('form').submit();
    // });
});
function select_race(race_id, search_value = ""){
    console.log(race_id);
    $('#current_race_id').val(race_id);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });
    jQuery.ajax({
      url: "/rides/app/getRiders_Results/"+race_id,
      method: 'get',
      data: {search_value: search_value},
      success: function(result){
         payment_method = [
             'cash',
             'check'
         ];
         rider_category = [
             'senior',
             'youth',
             'junior'
         ];
          
         riders_section = '';
         results_section = '';
         result_data = JSON.parse(result);
         if(result_data.length > 0){
             for(i = 0; i < result_data.length; i ++){
                 riders_section += '<div class="rider-item rider-item-'+result_data[i]['id']+'">';
                 riders_section += '<div class="item-detail">';
                 riders_section += '<div class="name col-xs-6">'+result_data[i]['rider_name']+'</div>';
                 riders_section += '<div class="rider_id col-xs-3"><span>Rider ID: </span>'+result_data[i]['rider_id']+'</div>';
                 riders_section += '<div class="rider_number col-xs-3"><span>Rider Number: </span>'+result_data[i]['rider_number']+'</div>';

                 riders_section += '<div class="other horse-name col-xs-6">Horse Name: '+result_data[i]['horse_name']+'</div>';
                 riders_section += '<div class="other amount-paid col-xs-6">Amount Paid: $'+result_data[i]['amount_paid']+'</div>';
                 riders_section += '<div class="other horse-id col-xs-6">Horse ID: '+result_data[i]['horse_id']+'</div>';
                 riders_section += '<div class="other payment-note col-xs-6">Payment Note: '+result_data[i]['payment_note']+'</div>';
                 riders_section += '<div class="other category col-xs-6">Category: '+result_data[i]['rider_category_name']+'</div>';
                 riders_section += '<div class="other payment-method col-xs-6">Payment Methods: '+result_data[i]['payment_method_name']+'</div>';

                 riders_section += '</div>';
                 riders_section += '<div class="item-actions">';
                 riders_section += '<a href="javascript:edit_rider('+result_data[i]['id']+');" class="btn btn-primary">Edit</a>';
                 riders_section += '<a href="javascript:delete_rider('+result_data[i]['id']+');" class="btn btn-primary">Delete</a>';
                 riders_section += '</div>';
                 riders_section += '</div>';
                 riders_section += '<div class="edit-rider-section edit-rider-section-'+result_data[i]['id']+' col-xs-12">';
                 riders_section += '<form action="#'+result_data[i]['id']+'" class="editRiderForm">';

                riders_section += '<div class="form-group col-xs-6">';
                riders_section += '    <label for="name">Rider Name</label>';
                riders_section += '    <input type="text" class="form-control" name="name" placeholder="Rider Name" value="'+result_data[i]['rider_name']+'">';
                riders_section += '</div>';
                riders_section += '<div class="form-group col-xs-6">';
                riders_section += '    <label for="rider_id">Rider ID</label>';
                riders_section += '    <input type="number" class="form-control" name="rider_id" placeholder="ID" value="'+result_data[i]['rider_id']+'">';
                riders_section += '</div>';
                riders_section += '<div class="form-group col-xs-6">';
                riders_section += '    <label for="horse_name">Horse Name</label>';
                riders_section += '    <input type="text" class="form-control" name="horse_name" placeholder="Horse Name" value="'+result_data[i]['horse_name']+'">';
                riders_section += '</div>';
                riders_section += '<div class="form-group col-xs-6">';
                riders_section += '    <label for="name">Horse ID</label>';
                riders_section += '    <input type="text" class="form-control" name="horse_id" placeholder="Horse ID" value="'+result_data[i]['horse_id']+'">';
                riders_section += '</div>';
                riders_section += '<div class="form-group col-xs-6">';
                riders_section += '    <label for="name">Rider Number</label>';
                riders_section += '    <input type="number" class="form-control" name="rider_number" placeholder="Rider Number" value="'+result_data[i]['rider_number']+'">';
                riders_section += '</div>';
                riders_section += '<div class="form-group col-xs-6">';
                riders_section += '    <label for="name">Amount Paid</label>';
                riders_section += '    <input type="number" class="form-control" name="amount_paid" placeholder="Amount Paid" value="'+result_data[i]['amount_paid']+'">';
                riders_section += '</div>';
                riders_section += '<div class="form-group col-xs-12">';
                riders_section += '    <label for="name">Payment Note</label>';
                riders_section += '    <input type="text" class="form-control" name="payment_note" placeholder="Payment Note" value="'+result_data[i]['payment_note']+'">';
                riders_section += '</div>';
                riders_section += '<div class="form-group col-xs-12">';
                riders_section += '    <label for="name">Payment Method</label>';
                riders_section += '    <select name="payment_method" class="form-control" >';
                for(index = 1; index < 3; index ++)
                    if(index == result_data[i]['payment_method_id'])
                        riders_section += '<option value="'+index+'" selected>'+result_data[i]['payment_method_name']+'</option>';
                    else
                        riders_section += '<option value="'+index+'">'+payment_method[index-1]+'</option>';
                riders_section += '    </select>';
                riders_section += '</div>';
                riders_section += '<div class="form-group col-xs-12">';
                riders_section += '    <label for="name">Category</label>';
                riders_section += '    <select name="category" class="form-control" >';
                for(index = 1; index < 4; index ++)
                    if(index == result_data[i]['rider_category_id'])
                        riders_section += '<option value="'+index+'" selected>'+result_data[i]['rider_category_name']+'</option>';
                    else
                        riders_section += '<option value="'+index+'">'+rider_category[index-1]+'</option>';
                riders_section += '    </select>';
                riders_section += '</div>';

                riders_section += '<div class="form-group col-xs-12">';
                riders_section += '    <a href="javascript:editRider('+result_data[i]['id']+');" type="button" class="btn btn-primary">Save</a>';
                riders_section += '</div>';

                 riders_section += '</form>';
                 riders_section += '</div>'; 
                 riders_section += '<div class="delete-rider-section delete-rider-section-'+result_data[i]['id']+' col-xs-12">';
                 riders_section += '<h3>Are you sure you want to delete this rider?</h3>';
                 riders_section += '<p>This cannot be undone.</p>';
                 riders_section += '<div class="action">';
                 riders_section += '<a href="javascript:cancel_delete_rider('+result_data[i]['id']+');" class="btn btn-default cancel-delete-section">cancel</a>';
                 riders_section += '<a href="javascript:deleteRider('+result_data[i]['id']+');" class="btn btn-warning delete-delete-section">Delete</a>';
                 riders_section += '</div>';
                 riders_section += '</div>';

                //  results-section

                 results_section += '<div class="result-item result-item-'+result_data[i]['rider_result_id']+'">';
                 results_section += '<div class="item-detail">';
                 results_section += '<div class="name col-xs-6">'+result_data[i]['rider_name']+'</div>';
                 results_section += '<div class="rider_id col-xs-3"><span>Rider ID: </span>'+result_data[i]['rider_id']+'</div>';
                 results_section += '<div class="rider_number col-xs-3"><span>Rider Number: </span>'+result_data[i]['rider_number']+'</div>';
                 
                 results_section += '<div class="other finish-time col-xs-6">Finish Time: '+result_data[i]['finish_time']+'</div>';
                 results_section += '<div class="other soundness-score col-xs-6">Soundness Score: '+result_data[i]['soundness_score']+'</div>';
                 results_section += '<div class="other recovery-score col-xs-6">Recovery Score: '+result_data[i]['recovery_score']+'</div>';
                 results_section += '<div class="other quality_of_movement_score col-xs-6">Quality of Movement Score: '+result_data[i]['quality_of_movement_score']+'</div>';
                 results_section += '<div class="other hydration-score col-xs-6">Hydration Score: '+result_data[i]['hydration_score']+'</div>';
                 results_section += '<div class="other weight col-xs-6">Weight(in lbs): '+result_data[i]['weight']+'</div>';
                 results_section += '<div class="other lesions-score col-xs-6">Lesions Score: '+result_data[i]['lesions_score']+'</div>';
                 
                 results_section += '</div>';
                 results_section += '<div class="item-actions">';
                 results_section += '<a href="javascript:edit_result('+result_data[i]['rider_result_id']+');" class="btn btn-primary">Edit</a>';
                 results_section += '</div>';
                 results_section += '</div>';
                 results_section += '<div class="edit-result-section edit-result-section-'+result_data[i]['rider_result_id']+' col-xs-12">';
                 results_section += '<form action="#'+result_data[i]['rider_result_id']+'" class="editResultForm">';

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
                results_section += '    <input type="time" class="form-control" name="finish_time" placeholder="Finish Time" value="'+result_data[i]['finish_time']+'">';
                results_section += '</div>';
                results_section += '<div class="form-group col-xs-6">';
                results_section += '    <label for="horse_name">Recovery Score</label>';
                results_section += '    <input type="number" class="form-control" name="recovery_score" placeholder="Recovery Score" value="'+result_data[i]['recovery_score']+'">';
                results_section += '</div>';
                results_section += '<div class="form-group col-xs-6">';
                results_section += '    <label for="name">Hydration Score</label>';
                results_section += '    <input type="number" class="form-control" name="hydration_score" placeholder="Hydration Score" value="'+result_data[i]['hydration_score']+'">';
                results_section += '</div>';
                results_section += '<div class="form-group col-xs-6">';
                results_section += '    <label for="name">Lesions Score</label>';
                results_section += '    <input type="number" class="form-control" name="lesions_score" placeholder="Lesions Score" value="'+result_data[i]['lesions_score']+'">';
                results_section += '</div>';
                results_section += '<div class="form-group col-xs-6">';
                results_section += '    <label for="name">Soundness Score</label>';
                results_section += '    <input type="number" class="form-control" name="soundness_score" placeholder="Soundness Score" value="'+result_data[i]['soundness_score']+'">';
                results_section += '</div>';
                results_section += '<div class="form-group col-xs-6">';
                results_section += '    <label for="name">Quality of Movement Score</label>';
                results_section += '    <input type="number" class="form-control" name="quality_of_movement_score" placeholder="Quality of Movement Score" value="'+result_data[i]['quality_of_movement_score']+'">';
                results_section += '</div>';
                results_section += '<div class="form-group col-xs-6">';
                results_section += '    <label for="name">Weight</label>';
                results_section += '    <input type="number" class="form-control" name="weight" placeholder="Weight" value="'+result_data[i]['weight']+'">';
                results_section += '</div>';

                results_section += '<div class="form-group col-xs-12">';
                results_section += '    <a href="javascript:editRiderResult('+result_data[i]['rider_result_id']+');" type="button" class="btn btn-primary">Save</a>';
                results_section += '</div>';

                 results_section += '</form>';
                 results_section += '</div>';
                 
             }
         }
         else{
            riders_section = '<div class="rider-item">';
             riders_section += 'No Rider Found';
             riders_section += '<p>Please add a Rider.</p>';
             riders_section += '</div>';

             results_section = '<div class="rider-item">';
             results_section = 'No results';
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
        
        $('.btn-submit').click(function(){
            $(this).parents('form').submit();
        });
      }
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
    eventdbInstance.read(event_id).then(event => {
        race = event.race;
        race_list = '';
        for(i = race.length - 1; i >= 0; i --){
            race_list += '<div class="race-item race-item-'+race[i]._id+'" onclick="select_race('+race[i]._id+')">';
            race_list += '    <div class="item-detail">';
            race_list += '        <div class="name col-xs-6">'+race[i].distance+' miles</div>';
            race_list += '        <div class="other col-xs-6">';
            race_list += '            <div class="start_time">Start time: '+race[i].start_time+'</div>';
            race_list += '            <div class="start_number">Start number: '+race[i].start_number+'</div>';
            race_list += '            <div class="hold_time">Hold time: '+race[i].hold_time+'</div>';
            race_list += '        </div>';
            race_list += '    </div>';
            race_list += '    <div class="item-actions">';
            race_list += '        <a href="javascript:edit_race('+race[i]._id+');" class="btn btn-primary">Edit</a>';
            race_list += '        <a href="javascript:delete_race('+race[i]._id+');" class="btn btn-primary">Delete</a>';
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
            race_list += '            <a href="javascript:editRace('+race[i]._id+');" type="button" class="btn btn-primary" data-dismiss="modal">Save</a>';
            race_list += '          </div>';
            race_list += '  </form>';
            race_list += '</div>';
            race_list += '<div class="delete-race-section delete-race-section-'+race[i]._id+'">';
            race_list += '    <h3>Are you sure you want to delete this race?</h3>';
            race_list += '    <p>This cannot be undone.</p>';
            race_list += '    <div class="action">';
            race_list += '        <a href="javascript:cancel_delete_race('+race[i]._id+');" class="btn btn-default cancel-delete-section">cancel</a>';
            race_list += '        <a href="javascript:deleteRace('+race[i]._id+');" class="btn btn-warning delete-delete-section">Delete</a>';
            race_list += '    </div>';
            race_list += '</div>';
        }
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
    });
}

function addRace(){
    if(!$("#addRaceForm").valid())
            return;
    race_data = {
        distance: $("#addRaceForm input[name='distance']").val(),
        start_time: $("#addRaceForm input[name='start_time']").val(),
        start_number: $("#addRaceForm input[name='start_number']").val(),
        hold_time: $("#addRaceForm input[name='hold_time']").val(),
        _id: Date.now()
    }
    eventdbInstance.addRace(event_id, race_data).then(race =>{
        view_races();
        $('#addRace button.close').click();
    });
    // $.ajaxSetup({
    //     headers: {
    //         'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
    //     }
    // });
    // jQuery.ajax({
    //   url: "/rides/app/add_race",
    //   method: 'get',
    //   data: $("#addRaceForm").serialize(),
    //   success: function(result){
        // race = JSON.parse(result);
    
    
    //     $('.event-section .tab-content #home .list').prepend(new_race);
    //     $('#addRace button.close').click();
    //     $('.event-section .tab-content #home .list').on('click', '.race-item-'+race['id'], function(){
    //         select_race(race['id']);
    //     });
    //     $('.race-item').click(function(){
    //         $('.race-item').removeClass('active');
    //         $('.race-item').find('.btn').removeClass('btn-default');
    //         $('.race-item').find('.btn').addClass('btn-primary');
    //         $(this).addClass('active');
    //         $(this).find('.btn').removeClass('btn-primary');
    //         $(this).find('.btn').addClass('btn-default');
    //     });
    //     $('.race-item-'+race['id']).click();
    //   }
    // });
}

function addRider(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });
    jQuery.ajax({
      url: "/rides/app/add_rider",
      method: 'get',
      data: $("#addRiderForm").serialize(),
      success: function(result){
         payment_method = [
             'cash',
             'check'
         ];
         rider_category = [
             'senior',
             'youth',
             'junior'
         ];
         rider = JSON.parse(result);
         new_rider = '';
         new_rider += '<div class="rider-item">';
         new_rider += '<div class="item-detail">';
         new_rider += '<div class="name col-xs-6">'+rider['rider_name']+'</div>';
         new_rider += '<div class="rider_id col-xs-3"><span>Rider ID: </span>'+rider['rider_id']+'</div>';
         new_rider += '<div class="rider_number col-xs-3"><span>Rider Number: </span>'+rider['rider_number']+'</div>';

         new_rider += '<div class="other col-xs-6">Horse Name: '+rider['horse_name']+'</div>';
         new_rider += '<div class="other col-xs-6">Amount Paid: $'+rider['amount_paid']+'</div>';
         new_rider += '<div class="other col-xs-6">Horse ID: '+rider['horse_id']+'</div>';
         new_rider += '<div class="other col-xs-6">Payment Note: '+rider['payment_note']+'</div>';
         new_rider += '<div class="other col-xs-6">Category: '+rider_category[rider['category_id']-1]+'</div>';
         new_rider += '<div class="other col-xs-6">Payment Methods: '+payment_method[rider['payment_method_id']-1]+'</div>';

         new_rider += '</div>';
         new_rider += '<div class="item-actions">';
         new_rider += '<a href="javascript:edit_rider('+rider['id']+');" class="btn btn-primary">Edit</a>';
         new_rider += '<a href="javascript:delete_rider('+rider['id']+');" class="btn btn-primary">Delete</a>';
         new_rider += '</div>';
         new_rider += '</div>';
         new_rider += '<div class="edit-rider-section edit-rider-section-'+rider['id']+' col-xs-12">';
         new_rider += '<form action="#'+rider['id']+'" class="editRiderForm">';

        new_rider += '<div class="form-group col-xs-6">';
        new_rider += '    <label for="name">Rider Name</label>';
        new_rider += '    <input type="text" class="form-control" name="name" placeholder="Rider Name" value="'+rider['rider_name']+'">';
        new_rider += '</div>';
        new_rider += '<div class="form-group col-xs-6">';
        new_rider += '    <label for="rider_id">Rider ID</label>';
        new_rider += '    <input type="number" class="form-control" name="rider_id" placeholder="ID" value="'+rider['rider_id']+'">';
        new_rider += '</div>';
        new_rider += '<div class="form-group col-xs-6">';
        new_rider += '    <label for="horse_name">Horse Name</label>';
        new_rider += '    <input type="text" class="form-control" name="horse_name" placeholder="Horse Name" value="'+rider['horse_name']+'">';
        new_rider += '</div>';
        new_rider += '<div class="form-group col-xs-6">';
        new_rider += '    <label for="name">Horse ID</label>';
        new_rider += '    <input type="text" class="form-control" name="horse_id" placeholder="Horse ID" value="'+rider['horse_id']+'">';
        new_rider += '</div>';
        new_rider += '<div class="form-group col-xs-6">';
        new_rider += '    <label for="name">Rider Number</label>';
        new_rider += '    <input type="number" class="form-control" name="rider_number" placeholder="Rider Number" value="'+rider['rider_number']+'">';
        new_rider += '</div>';
        new_rider += '<div class="form-group col-xs-6">';
        new_rider += '    <label for="name">Amount Paid</label>';
        new_rider += '    <input type="number" class="form-control" name="amount_paid" placeholder="Amount Paid" value="'+rider['amount_paid']+'">';
        new_rider += '</div>';
        new_rider += '<div class="form-group col-xs-12">';
        new_rider += '    <label for="name">Payment Note</label>';
        new_rider += '    <input type="text" class="form-control" name="payment_note" placeholder="Payment Note" value="'+rider['payment_note']+'">';
        new_rider += '</div>';
        new_rider += '<div class="form-group col-xs-12">';
        new_rider += '    <label for="name">Payment Method</label>';
        new_rider += '    <select name="payment_method" class="form-control" >';
        
        for(index = 1; index < 3; index ++)
            if(index == rider['payment_method_id'])
                new_rider += '<option value="'+index+'" selected>'+payment_method[index-1]+'</option>';
            else
                new_rider += '<option value="'+index+'">'+payment_method[index-1]+'</option>';
        
        new_rider += '    </select>';
        new_rider += '</div>';
        new_rider += '<div class="form-group col-xs-12">';
        new_rider += '    <label for="name">Category</label>';
        new_rider += '    <select name="category" class="form-control" >';
        
        for(index = 1; index < 4; index ++)
            if(index == rider['category_id'])
                new_rider += '<option value="'+index+'" selected>'+rider_category[index-1]+'</option>';
            else
                new_rider += '<option value="'+index+'">'+rider_category[index-1]+'</option>';
                
        new_rider += '    </select>';
        new_rider += '</div>';

        new_rider += '<div class="form-group col-xs-12">';
        new_rider += '    <a type="button" class="btn btn-primary">Save</a>';
        new_rider += '</div>';

         new_rider += '</form>';
         new_rider += '</div>'; 
         new_rider += '<div class="delete-rider-section delete-rider-section-'+rider['id']+' col-xs-12">';
         new_rider += '<h3>Are you sure you want to delete this rider?</h3>';
         new_rider += '<p>This cannot be undone.</p>';
         new_rider += '<div class="action">';
         new_rider += '<a href="javascript:cancel_delete_rider('+rider['id']+');" class="btn btn-default cancel-delete-section">cancel</a>';
         new_rider += '<a href="#'+rider['id']+'" class="btn btn-warning delete-delete-section">Delete</a>';
         new_rider += '</div>';
         new_rider += '</div>';
         $('.riders_results-section .tab-content #riders .list').prepend(new_rider);
         $('#addRider button.close').click();
      }
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
        hold_time: $(".edit-race-section-"+id+" input[name='hold_time']").val(),
        // _id: id
    }
    // console.log(race_data);
    // eventdbInstance.deleteRace(event_id, id).then(result => {
    //     eventdbInstance.addRace(event_id, race_data).then(race =>{
    //         $('.race-item-'+id+' .item-detail .name').html(race_data.distance+' miles');
    //         $('.race-item-'+id+' .item-detail .start_time').html('Start time: '+race_data.start_time);
    //         $('.race-item-'+id+' .item-detail .start_number').html('Start number: '+race_data.start_number);
    //         $('.race-item-'+id+' .item-detail .hold_time').html('Hold time: '+race_data.hold_time);
    //         $('.edit-race-section-'+id).hide();
    //     });
    // });

    eventdbInstance.updateRace(event_id, id, race_data).then(race => {
        console.log(race);
    });

    // $.ajaxSetup({
    //     headers: {
    //         'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
    //     }
    // });
    // jQuery.ajax({
    //   url: "/rides/app/edit_race/"+id,
    //   method: 'get',
    //   data: $(".edit-race-section-"+id+" form").serialize(),
    //   success: function(result){
    //       console.log(result);
    //       race = JSON.parse(result);
    //       console.log(race);
        //   $('.race-item-'+race['id']+' .item-detail .name').html(race['distance']+' miles');
        //   $('.race-item-'+race['id']+' .item-detail .start_time').html('Start time: '+race['start_time']);
        //   $('.race-item-'+race['id']+' .item-detail .start_number').html('Start number: '+race['start_number']);
        //   $('.race-item-'+race['id']+' .item-detail .hold_time').html('Hold time: '+race['hold_time']);
        //   $('.edit-race-section-'+race['id']).hide();
    //   }
    // });
}

function editRider(id){
    if(!$(".edit-rider-section-"+id+" form").valid())
        return;
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });
    jQuery.ajax({
      url: "/rides/app/edit_rider/"+id,
      method: 'get',
      data: $(".edit-rider-section-"+id+" form").serialize(),
      success: function(result){
          rider= JSON.parse(result);
          $('.rider-item-'+rider['id']+' .item-detail .name').html(rider['rider_name']);
          $('.rider-item-'+rider['id']+' .item-detail .rider_id').html('<span>Rider ID: </span>'+rider['rider_id']);
          $('.rider-item-'+rider['id']+' .item-detail .rider_number').html('<span>Rider Number: </span>'+rider['rider_number']);
          $('.rider-item-'+rider['id']+' .item-detail .horse-name').html('Horse Name: '+rider['horse_name']);
          $('.rider-item-'+rider['id']+' .item-detail .amount-paid').html('Amount Paid: $'+rider['amount_paid']);
          $('.rider-item-'+rider['id']+' .item-detail .horse-id').html('Horse ID: '+rider['horse_id']);
          $('.rider-item-'+rider['id']+' .item-detail .payment-note').html('Payment Note: '+rider['payment_note']);
          $('.rider-item-'+rider['id']+' .item-detail .category').html('Category: '+rider['category_name']);
          $('.rider-item-'+rider['id']+' .item-detail .payment-method').html('Payment Methods: '+rider['payment_method_name']);
          $('.edit-rider-section-'+rider['id']).hide();
      }
    });
}


function editRiderResult(id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });
    jQuery.ajax({
      url: "/rides/app/edit_rider_result/"+id,
      method: 'get',
      data: $(".edit-result-section-"+id+" form").serialize(),
      success: function(result){
          rider= JSON.parse(result);
          $('.result-item-'+rider['id']+' .item-detail .finish-time').html('Finish Time: '+rider['finish_time']);
          $('.result-item-'+rider['id']+' .item-detail .soundness-score').html('Soundness Score: '+rider['soundness_score']);
          $('.result-item-'+rider['id']+' .item-detail .recovery-score').html('Recovery Score: '+rider['recovery_score']);
          $('.result-item-'+rider['id']+' .item-detail .quality_of_movement_score').html('Quality of Movement Score: '+rider['quality_of_movement_score']);
          $('.result-item-'+rider['id']+' .item-detail .hydration-score').html('Hydration Score: '+rider['hydration_score']);
          $('.result-item-'+rider['id']+' .item-detail .weight').html('Weight(in lbs): '+rider['weight']);
          $('.result-item-'+rider['id']+' .item-detail .lesions-score').html('Lesions Score: '+rider['lesions_score']);
          $('.edit-result-section-'+rider['id']).hide();
      }
    });
}

function deleteRace(id){
    // $.ajaxSetup({
    //     headers: {
    //         'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
    //     }
    // });
    // jQuery.ajax({
    //   url: "/rides/app/delete_race/"+id,
    //   method: 'get',
    //   data: {},
    //   success: function(result){
    //       id = JSON.parse(result);
    //       $('.race-item-'+id).remove();
    //       $('.edit-race-section-'+id).remove();
    //       $('.delete-race-section-'+id).remove();
    //   }
    // });
    eventdbInstance.deleteRace(event_id, id).then(result => {
        $('.race-item-'+id).remove();
        $('.edit-race-section-'+id).remove();
        $('.delete-race-section-'+id).remove();
    });
}

function deleteRider(id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });
    jQuery.ajax({
      url: "/rides/app/delete_rider/"+id,
      method: 'get',
      data: {},
      success: function(result){
          id = JSON.parse(result);
          $('.rider-item-'+id).remove();
          $('.edit-rider-section-'+id).remove();
          $('.delete-rider-section-'+id).remove();
      }
    });
}

function search_rider(){
    race_id = $('#current_race_id').val();
    search_value = $('#txtSearch').val();
    select_race(race_id, search_value);
}