const {remote} = require('electron');

const eventdbInstance = remote.getGlobal('eventdb');

$(document).ready(function(){
    $('select').selectpicker();
    rider_results('senior');
    // $('#selected_race').change(function(){
    //   rider_results($(this).val());
    // });
    $('.btnprn').printPage();
});
function rider_results(rider_category){
    race_id = $('#selected_race').val();
    $('.btnprn').attr('href', '/rides/app/event_result_print_page/<?php echo $event->id;?>/'+race_id+'/'+rider_category)
    
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });
    jQuery.ajax({
        url: "/rides/app/getRiders_Results/"+race_id,
        method: 'get',
        data: {},
        success: function(result){
            result_data = JSON.parse(result);
            senior_section = '';
            youth_section = '';
            junior_section = '';
            if(result_data.length > 0){
                for(i = 0; i < result_data.length; i ++){
                    row = '<tr>';
                    row += '<td>'+(result_data[i]['pull_code_id']?result_data[i]['pull_code_id']:'')+'</td>';
                    row += '<td>'+result_data[i]['id']+'</td>';
                    row += '<td>'+result_data[i]['rider_name']+'</td>';
                    row += '<td>'+result_data[i]['rider_id']+'</td>';
                    row += '<td>'+result_data[i]['horse_name']+'</td>';
                    row += '<td>'+result_data[i]['horse_id']+'</td>';
                    row += '<td>'+(result_data[i]['finish_time']?result_data[i]['finish_time']:'')+'</td>';
                    row += '<td>'+(result_data[i]['pull_code_name']?result_data[i]['pull_code_name']:'')+'</td>';
                    row += '<td>'+(result_data[i]['weight']?result_data[i]['weight']:'')+'</td>';
                    row += '<td>'+''+'</td>';
                    row += '<td>'+''+'</td>';
                    row += '<td>'+''+'</td>';
                    row += '<td>'+''+'</td>';
                    row += '<td>'+''+'</td>';
                    row += '</tr>';
                    switch(result_data[i]['rider_category_name']){
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
                $('#senior tbody').html(senior_section);
                $('#youth tbody').html(youth_section);
                $('#junior tbody').html(junior_section);
            }
        }
    });
}