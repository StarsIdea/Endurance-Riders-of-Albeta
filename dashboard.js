const {remote} = require('electron');

const eventdbInstance = remote.getGlobal('eventdb');

$(document).ready(function(){
    view_event_list();
    add_action_to_object();
    $("#addEventForm").validate({

        rules: {
            name: {
                required: true,
                maxlength: 50
            },

            date: {
                required: true,
                maxlength: 50,
                date: true,
            },

        },
        messages: {

            name: {
                required: "Please enter name",
            },
            date: {
                required: "Please enter date",
            },

        },
    });
    
});

function view_event_list(){
    eventdbInstance.readAll().then(events => {
        // console.log(events);
        event_list = '';
        for(i = 0; i < events.length; i ++){
            event_list += '<div class="event-item event-item-'+events[i]['_id']+'">';
            event_list += '    <div class="item-detail">';
            event_list += '        <div class="name">'+events[i]['name']+'</div>';
            event_list += '        <div class="date">'+events[i]['date']+'</div>';
            event_list += '    </div>';
            event_list += '    <div class="item-actions">';
            event_list += '        <a href="event-editor.html" class="btn btn-primary process-by-event" data-id="'+events[i]['_id']+'">Edit Event</a>';
            event_list += '        <a href="event-results.html" class="btn btn-primary process-by-event" data-id="'+events[i]['_id']+'">View Results</a>';
            event_list += '        <a href="admin.html" class="btn btn-primary process-by-event" data-id="'+events[i]['_id']+'">Admin</a>';
            event_list += '        <a href="javascript:delete_event_view('+"'"+events[i]['_id']+"'"+');" class="btn btn-primary">Delete</a>';
            event_list += '    </div>';
            event_list += '</div>';
            event_list += '<div class="delete-section delete-section-'+events[i]['_id']+'">';
            event_list += '    <h3>Are you sure you want to delete this race?</h3>';
            event_list += '    <p>This cannot be undone.</p>';
            event_list += '    <div class="action">';
            event_list += '        <a href="#" class="btn btn-default cancel-delete-section">cancel</a>';
            event_list += '        <a href="javascript:deleteEvent('+"'"+events[i]['_id']+"'"+');" class="btn btn-warning delete-delete-section">Delete</a>';
            event_list += '    </div>';
            event_list += '</div>';
        }
        $('.dashboard.event-list .list').html(event_list);
        add_action_to_object();
    });
}

function add_action_to_object(){
    $('.cancel-delete-section').click(function(){
        $(this).parents(".delete-section").hide();
    });
    $('.process-by-event').click(function(e){
        e.preventDefault();
        remote.getGlobal('sharedObj').event_id = $(this).attr('data-id');
        // remote.getGlobal('event_id') = $(this).attr('data-id');
        document.location.href=$(this).attr("href");
    });
}

function delete_event_view(id){
    $('.delete-section-'+id).show();
}
function addEvent(){
    if(!$("#addEventForm").valid())
        return;
    data = {
        name: $("#addEventForm input[name='name']").val(),
        date: $("#addEventForm input[name='date']").val()
    };
    console.log(eventdbInstance.validate(data));
    eventdbInstance.create(data).then(result => {
        $('#addEvent button.close').click();
        view_event_list();
    });
}

function deleteEvent(id){
    eventdbInstance.delete(id).then(result =>{
        view_event_list();
    });
}