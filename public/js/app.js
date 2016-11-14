$(function () {
  var socket = io.connect();
  var $messageForm = $('#messageForm');
  var $message = $('#message');
  var $chat = $('#chat');
  var $userForm =$('#userForm');
  var $userFormArea =$('#userFormArea');
  var $username = $('#username');
  var $users = $('#users');


  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', $message.val());
    $message.val('');
  });

  socket.on('new message', function(data) {
    $chat.append('<p style="color:blue;padding: 1% 2%;margin: 0"><em>'+data.user+'</em> : '+data.msg+'</p>');
  });

  $userForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user', $username.val(), function(data) {
      if(!data) console.log('New User Logged in');
    });
    $username.val('');
  });

  socket.on('get users', function(data) {
    var userslist = '';
    for(i = 0;i < data.length;i++){
      userslist += '<li class="list-group-item" style="color:green">'+data[i]+'</li>'
    }
    $users.html(userslist);
  })



  window.onload = function () {
      $("#mainContent").hide();
  }

  $("#lets_play_btn").click(function() {
    $("#bg_img").hide(700);
    $("#username").hide(700);
    $("#lets_play_btn").hide(700, function() {
      $("#mainContent").show();
      $("#myModal").modal('show');
    });
  })

  $("#que_btn_add").click(function() {
    $("#myModal").modal('show');
  });

$("#score_btn").click(function() {

    $("#show_score").show();


    $.ajax({
            method: "GET",
            url: "http://localhost:3000/score",
            crossDomain: true,
            dataType: "json"
        })
        .done(function(msg) {
            if (msg.answer == false) {
                msg.answer = "false";
            }
            console.log(msg);
            $("#right_ans").text(msg.right);
            $("#wrong_ans").text(msg.wrong);
        });
});

$("#submitBtnId").click(function() {

    alert("question set is stored in Database")
});


$(".btn1").click(function() {

    var question = $("#que_id").val();
    //console.log(question);
    var answer = $("#ans_id").val();
    //console.log(answer);

    var data = {
        "question": question,
        "answer": answer
    }

    var dataJSON = JSON.stringify(data);
    console.log(dataJSON);
    $.ajax({
            method: "POST",
            url: "http://localhost:3000/question",
            crossDomain: true,
            dataType: "json",
            data: data
        })
        .done(function(msg) {

            if (msg.answer == false) {
                msg.answer = "false";
            }
            $("#show_que").show();
            $("#que_btn_add").show();

            var displayQuestions = function(element, index, array) {
                $("#show_score").show();
                //console.log(array);
                var len = array.length;
                console.log(len);
                if (index == array.length - 1) {

                    var $item = $(
                      '<form>' +
                      '<div id="allQueId" class="btn1">' +
                      '<div class="well">' +
                      '<p class="text-left"><strong>Question: </strong><input type="text" class="formQuestion" disabled="disabled" name="que" id="queId' + index + '"></p>' +
                      '<p class="text-left"><input type="text" class="formAnswer" name="ans" placeholder="Please Enter your Answer" id="ansId' + index + '"></p>' +
                      '<p class="text-center"><input type="button" class="btn btn-primary" value="Submit Answer" id="sendBtnId' + index + '"></p>' +
                      '</div>' +
                      '</div' +
                      '</form>'
                    );

                    $("#show_que").append($item);
                    $("#queId" + index).val(array[index].question);
                }

            }

            msg.forEach(displayQuestions);

        });
});

$("#lets_play_btn").click(function() {



    $.ajax({
        method: "GET",
        url: "http://localhost:3000/question",
        crossDomain: true,
        dataType: "json",
    })

    .done(function(msg) {

        //console.log(msg);
        if (msg.answer == false) {
            msg.answer = "false";
        }
        $("#allQueId").show();
        $("#score_btn").show();
        $("#que_btn_add").show();

        $("#show_score").show();


        $.ajax({
                method: "GET",
                url: "http://localhost:3000/score",
                crossDomain: true,
                dataType: "json"
            })
            .done(function(msg) {
                if (msg.answer == false) {
                    msg.answer = "false";
                }
                console.log(msg);
                $("#right_ans").text(msg.right);
                $("#wrong_ans").text(msg.wrong);
            });

      var displayQuestions = function(element, index, array) {

            var $item = $(
                '<form>' +
                '<div id="allQueId" class="btn1">' +
                '<div class="well">' +
                '<p class="text-left"><strong>Question: </strong><input type="text" class="formQuestion" disabled="disabled" name="que" id="queId' + index + '"></p>' +
                '<p class="text-left"><input type="text" class="formAnswer" name="ans" placeholder="Please Enter your Answer" id="ansId' + index + '"></p>' +
                '<p class="text-center"><input type="button" class="btn btn-primary" value="Submit Answer" id="sendBtnId' + index + '"></p>' +
                '</div>' +
                '</div' +
                '</form>'
            );

            $("#show_que").append($item);
            $("#queId" + index).val(array[index].question);

        }

        msg.forEach(displayQuestions);


        var getAnswers = function(element, index, array) {

            $("#sendBtnId" + index).click(function() {
                alert("Your Answer has been Recorded..!");

                var ans = $("#ansId" + index).val();
                var ansId = array[index]._id;
                var actualAns = array[index].answer;

                // console.log(ans);
                //console.log(ansId);

                var data = {
                    "ans_id": ansId,
                    "possibleAns": ans,
                    "answer": actualAns
                }
                var dataJSON = JSON.stringify(data);
                // console.log(JSON.stringify(data));
                $.ajax({

                    method: "POST",
                    url: "http://localhost:3000/answer",
                    crossDomain: true,
                    dataType: "json",
                    data: data
                })

                .done(function(msg) {

                    //console.log(msg);
                    if (msg.answer == false) {
                        msg.answer = "false";
                    }


                })
                $("#show_score").show();


                $.ajax({
                        method: "GET",
                        url: "http://localhost:3000/score",
                        crossDomain: true,
                        dataType: "json"
                    })
                    .done(function(msg) {
                        if (msg.answer == false) {
                            msg.answer = "false";
                        }
                        console.log(msg);
                        $("#right_ans").text(msg.right);
                        $("#wrong_ans").text(msg.wrong);
                    });
            });
        }
        msg.forEach(getAnswers);

    });
});
});
