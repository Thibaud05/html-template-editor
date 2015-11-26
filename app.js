(function() {
var t = new Date().getTime()

 $.getJSON( "data.json?"+t).done(function(data){
    console.log(data)
    $.get( "template.html?"+t, function(mailTemplate) {
      //console.log(mailTemplate)
      //console.log(data.date)
      $( "#mailContent" ).html( mailTemplate );

      $('a[href$="}"]').each(function(i) {
        $(this).wrap('<span class="editable source" id="article' + (i+1) +'.source"></span>');
      })

      mailTemplate = $( "#mailContent" ).html();


      mailTemplate = mailTemplate.replace("{date}", "<span class='editable date' id='date'>"+data.date+"</span>");
      var i=0
      for(index in data.articles){
        var article = data.articles[index]
        i++
        console.log(i)
        mailTemplate = mailTemplate.replace("{article" + i +".title}", "<span class='editable title' id='article" + i +".title'>"+article.title+"</span>");
        mailTemplate = mailTemplate.replace("{article" + i +".description}", "<span class='editable desc' id='article" + i +".description'>"+article.description+"</span>");
        mailTemplate = mailTemplate.replace("{article" + i +".source}", article.source);
      }
      $( "#mailContent" ).html( mailTemplate );

      $("#btn_save").hide()

      $("#btn_edit").click(function(e){
        e.preventDefault()
        $("#btn_save").show()
        $("#btn_edit").hide()
        $( ".editable" ).each(function() {
            if($(this).hasClass( "source" )){
                var content = $(this).find( "a" ).attr("href");
                $(this).append('<input type="text" value="'+ content +'"/>')
            }else if($(this).hasClass( "desc" )){
                var content = $(this).html();
                content = content.replace(/<br>/g, "\n");
                $(this).html('<textarea>'+ content +'</textarea>')
              }else{
                var content = $(this).html();
                $(this).html('<input type="text" value="'+ content +'"/>')
              }

        });
      })

      $("#btn_save").click(function(e){
        window.scrollTo(0,0)
        e.preventDefault()
        $("#btn_save").hide()
        $("#btn_edit").show()
        var json = {"articles":[]}
        $( ".editable" ).each(function() {
          var content = ""
          if($(this).hasClass( "source" )){
            content = $(this).find( "input" ).val();
            $(this).find( "a" ).attr("href",content)
            $(this).find( "input" ).remove()
          }else if($(this).hasClass( "desc" )){
            content = $(this).find( "textarea" ).val();
            content = content.replace(/\n/g, "<br>");
            content = content.replace(/\r\n/g, "<br>");
            $(this).html(content)
          }else{
            content = $(this).find( "input" ).val();
            $(this).html(content)
          }

          // Build json
          var field = $(this).attr("id").split(".")
          if(field[1]== undefined){
            json["date"] = content
          }else{
            var index = field[0].split("article")[1]-1
            if(json["articles"][index]==undefined){
              json["articles"][index] = {}
            }
            json["articles"][index][field[1]] = content
          }



        });
        //console.log(json)
        $.post( "index.php?"+t, {"data":JSON.stringify(json)})
          .done(function( data ) {
            console.log("ok")
            $("#statusBar").fadeIn( 400 ).delay( 400 ).fadeOut( 400 );
          });

      })
      

    });
 });


})();