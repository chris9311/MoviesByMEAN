/**
 * Created by HUANGCH4 on 2015/7/29.
 */
$(function(){
    //$('.del').click(function(e){
    //    var target = $(e.target);
    //    var id = target.data('id');
    //    var tr = $('.item-id-'+id);
    //
    //    $.ajax({
    //        type:'DELETE',
    //        url:'/movie/list?id='+id,
    //    }).done(function(result){
    //        if(result.success){
    //            if(tr.length> 0){
    //                tr.remove();
    //            }
    //        }
    //    })
    //})

    $('#douban').blur(function(){
        var douban = $(this);
        var id = douban.val();

    });
});


