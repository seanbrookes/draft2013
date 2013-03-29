/**
 * Draft 2013
 *
 * User: sean
 * Date: 25/03/13
 * Time: 8:23 AM
 *
 */
define(
    ['client','jquery','text!/modules/chat/chat-template.html','prettydate'],
    function(App, $, markup) {

        var that = this;


        var sf1 = App.sf1;
        var anchorSelector = '#TemplateContainer';
        var chatDirection = 'newest-at-bottom';
        // namespace for var reference in template
        _.templateSettings.variable = 'S';

        var currentAuthRoster;
        var baseMarkup = $(markup);
        $(anchorSelector).append(baseMarkup);

        // create global app parameters...
        var NICK_MAX_LENGTH = 15,
            ROOM_MAX_LENGTH = 10,
            lockShakeAnimation = false,
            socket = null,
            clientId = null,
            nickname = null,

        // holds the current room we are in
            currentRoom = null,

        // server information

            serverAddress = null,
            serverDisplayName = 'Server',
            serverDisplayColor = '#1c5380',

        // some templates we going to use in the chat,
        // like message row, client and room, this
        // templates will be rendered with jQuery.tmpl
            tmplt = {
                room: [
                    '<li data-roomId="${room}">',
                    '<span class="icon"></span> ${room}',
                    '</li>'
                ].join(""),
                client: [
                    '<li data-clientId="${clientId}" class="cf">',
                    '<div class="fl clientName"><span class="icon"></span> ${nickname}</div>',
                    '<div class="fr composing"></div>',
                    '</li>'
                ].join(""),
                message: [
                    '<li class="cf">',
                    '<div class="fl sender">${sender}: </div><div class="fl text">${text}</div><div class="fr time">${time}</div>',
                    '</li>'
                ].join("")
            };

        var currentUrl = document.location.href;
        if (currentUrl.indexOf('localhost') > -1){
            serverAddress = 'localhost';
        }
        else{
            serverAddress = 'http://draft2013.herokuapp.com';
        }


        /*
         * Chat Item Model / Collection
         *
         * */
        var ChatItemModel = Backbone.Model.extend({});
        var ChatItemCollection = Backbone.Collection.extend({
            model: ChatItemModel
        });
        /*
         *
         * Marionette Views
         *
         * */
        var ChatItemView = Backbone.Marionette.ItemView.extend({
            template: '#ChatItemTemplate',
            tagName: 'li'
        });

        /*
         * ChatListView
         *
         * */
        var ChatListView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'transcript-list'

        });



        var getCurrentAuthRoster = function(){
            if (sf1.hasStorage){
                return localStorage.getItem('currentAuthRoster');
            }
            else{
                return null;
            }
        };

        sf1.log('Chat module loaded ');

        /*
         *
         *
         * INIT TRASCRIPT
         *
         * */
        sf1.EventBus.bind('chat.initTranscript',function(event){
            // load the model from the db

//            if (chatDirection === 'newest-at-top'){
//
//            }
//            else{
//
//            }

            sf1.io.ajax({
                type:'GET',
                url:'/drafttranscript?chatDirection=' + chatDirection,
                success:function(response){
                    //sf1.log('GOT the Transcript');
                    var xzy = response;
                    //sf1.EventBus.trigger('chat.transcriptRefreshed',[response]);
                    var chatListView = new ChatListView({
                        itemView: ChatItemView,
                        collection: new ChatItemCollection(response)
                    });
                    $('.chat-messages').html(chatListView.render().$el);

                    if (chatDirection === 'newest-at-bottom'){
                        $('.chat-messages').animate({ scrollTop: $('.chat-messages ul').height() }, 100);
                    }
                    else{
                        $('.chat-messages').animate({ scrollTop: 0 }, 0);

                    }

                    //bindDOMEvents();
                    $('.chat-widget-input').val('');
                    $('.chat-widget-input').focus();


                    sf1.EventBus.trigger('chat.bindDOMEventsRequest');
                },
                error:function(response){
                    sf1.log('failed to get the transcript');
                }
            });
            // bind it to the DOM
            // trigger bind DOM events

        });






        //var userPreference = {};
        // use dashes in value for preference to allow for simple display by replacing dash
        // to server double duty as value and label
        //userPreference.chatTranscriptAddDirection = 'newest-at-top';

//                    if (userPreference.chatTranscriptAddDirection && (userPreference.chatTranscriptAddDirection === 'newest-at-top')){




















        sf1.EventBus.bind('chat.changeChatPreference',function(){
           sf1.log('FIRE CHANGE CHAT PREFERENCES ');
           var inputContainer;
           if (chatDirection === 'newest-at-top'){
               inputContainer = $('#BottomChatContainer').html();
               $('#TopChatContainer').empty();
               $('#BottomChatContainer').empty();
               $('#TopChatContainer').html(inputContainer);

           }
           else{
               inputContainer = $('#TopChatContainer').html();
               $('#BottomChatContainer').empty();
               $('#TopChatContainer').empty();
               $('#BottomChatContainer').html(inputContainer);
           }
           sf1.EventBus.trigger('chat.initTranscript');

        });




        sf1.EventBus.bind('chat.bindDOMEventsRequest',function(event){
            connect();
            bindDOMEvents();

        });


        /*
         *
         *   EVENT BINDINGS
         *
         *
         * TRASCRIPT REFRESHED
         *
         * */
        sf1.EventBus.bind('chat.transcriptRefreshed',function(event,arg){
            var messages = arg;
            var outputHtml = '';
            for (var i = 0;i < messages.length;i++){
                var messageItem = messages[i];
                // outputHtml += '<li class="chat-message-item"><span class="message-sender">' + messageItem.nickname + ':</span><span class="message-body">' + messageItem.message + '</span><span class="message-timestamp" title="' + messageItem.messageTimeStamp + '">' + messageItem.messageTimeStamp +'</span></li>';
                sf1.EventBus.trigger('chat.addNewChatMessage',[messageItem,event]);
            }
//            $('.chat-messages ul').append(outputHtml);
//            $('.message-timestamp').prettyDate();
//            $('.chat-messages').animate({ scrollTop: $('.chat-messages ul').height() }, 100);
        });
        sf1.EventBus.bind('chat.addNewChatMessage',function(event,data){

            //var userPreference = {};
            // use dashes in value for preference to allow for simple display by replacing dash
            // to server double duty as value and label
           // userPreference.chatTranscriptAddDirection = 'newest-at-top';
            // sf1.log('EVENT ADD CHAT MESSAGE: ' + data.nickname);

            var messageItemMarkup = '<li class="chat-message-item"><span class="message-sender">' + data.nickname + ':</span><span class="message-body">' + data.message + '</span><span class="message-timestamp" title="' + data.messageTimeStamp + '">' + Date.now() +'</span></li>';


            var chatMessageList = $('.chat-messages ul');
            if (chatDirection === 'newest-at-bottom'){
                chatMessageList.append(messageItemMarkup);
                $('.chat-messages').animate({ scrollTop: chatMessageList.height() }, 100);
            }
            else{
                chatMessageList.prepend(messageItemMarkup);
            }


            $('.message-timestamp').prettyDate();

            sf1.EventBus.trigger('chat.initTranscript');
        });
//        /*
//         *
//         *
//         * INIT TRASCRIPT
//         *
//         * */
//        sf1.EventBus.bind('chat.initTranscript',function(event){
//            // load the model from the db
//            sf1.io.ajax({
//                type:'GET',
//                url:'/drafttranscript',
//                success:function(response){
//                    //sf1.log('GOT the Transcript');
//                    var xzy = response;
//                    sf1.EventBus.trigger('chat.transcriptRefreshed',[response]);
//                    sf1.EventBus.trigger('chat.bindDOMEventsRequest');
//                },
//                error:function(response){
//                    sf1.log('failed to get the transcript');
//                }
//            });
//            // bind it to the DOM
//            // trigger bind DOM events
//
//        });

        // bind DOM elements like button clicks and keydown
        var bindDOMEvents = function(){

            $('.chat-widget-input').on('keydown', function(e){
                var key = e.which || e.keyCode;
                if(key === 13) { handleMessage(); }
            });

            $('.btn-chat-widget-post').on('click', function(){
                handleMessage();
            });


            $('.chat-rooms ul').on('scroll', function(){
                $('.chat-rooms ul li.selected').css('top', $(this).scrollTop());
            });

            $('.transcript-list').on('scroll', function(){
                var self = this;
                window.setTimeout(function(){
                    if($(self).scrollTop() + $(self).height() < $(self).find('ul').height()){
                        $(self).addClass('scroll');
                    } else {
                        $(self).removeClass('scroll');
                    }
                }, 50);
            });
            $('.message-timestamp').prettyDate();
        };

        // bind socket.io event handlers
        // this events fired in the server
        function bindSocketEvents(){

            // when the connection is made, the server emiting
            // the 'connect' event
            socket.on('connect', function(){
                // firing back the connect event to the server
                // and sending the nickname for the connected client
                nickname = getCurrentChatNickName();
                socket.emit('connect', { nickname: nickname });
            });

            // after the server created a client for us, the ready event
            // is fired in the server with our clientId, now we can start
            socket.on('ready', function(data){
                // hiding the 'connecting...' message
                $('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
                    $(this).hide();
                    $('.chat-widget-input').focus();
                });

                // saving the clientId localy
                clientId = data.clientId;
            });

            // after the initialize, the server sends a list of
            // all the active rooms
            socket.on('roomslist', function(data){
                for(var i = 0, len = data.rooms.length; i < len; i++){
                    // in socket.io, their is always one default room
                    // without a name (empty string), every socket is automaticaly
                    // joined to this room, however, we don't want this room to be
                    // displayed in the rooms list
                    if(data.rooms[i] != ''){
                        //addRoom(data.rooms[i], false);
                    }
                }
            });

            // when someone sends a message, the sever push it to
            // our client through this event with a relevant data
            socket.on('chatmessage', function(data){
                var nickname = data.client.nickname;
                var message = data.message;

                //display the message in the chat window
                insertMessage(nickname, message, true, false, false);
            });

            // when we subscribes to a room, the server sends a list
            // with the clients in this room
            socket.on('roomclients', function(data){

                // add the room name to the rooms list
                //addRoom(data.room, false);

                // set the current room
                setCurrentRoom(data.room);

                // announce a welcome message
                //insertMessage(serverDisplayName, 'welcome to the draft chat ', true, false, true);
                $('.chat-clients ul').empty();
                nickname = getCurrentChatNickName();
                // add the clients to the clients list
                addClient({ nickname: nickname, clientId: clientId }, false, true);
                for(var i = 0, len = data.clients.length; i < len; i++){
                    if(data.clients[i]){
                        addClient(data.clients[i], false);
                    }
                }

                // hide connecting to room message message
                $('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
                    $(this).hide();
                    $('.chat-widget-input').focus();
                });
            });


            // with this event the server tells us when a client
            // is connected or disconnected to the current room
            socket.on('presence', function(data){
                if(data.state == 'online'){
                    addClient(data.client, true);
                } else if(data.state == 'offline'){
                    removeClient(data.client, true);
                }
            });
        }


        // add a client to the clients list
        function addClient(client, announce, isMe){

            var html = '<li>' + client.nickname + '</li>';
            // var $html = $.tmpl(tmplt.client, client);

            // if this is our client, mark him with color
            if(isMe){
                //$(html).addClass('me');
            }

            // if announce is true, show a message about this client
            if(announce){
                // insertMessage(serverDisplayName, client.nickname + ' has joined the room...', true, false, true);
            }
            $('.chat-clients ul').append(html);
        }

        // remove a client from the clients list
        function removeClient(client, announce){
            $('.chat-clients ul li[data-clientId="' + client.clientId + '"]').remove();

            // if announce is true, show a message about this room
            if(announce){
                //insertMessage(serverDisplayName, client.nickname + ' has left the room...', true, false, true);
            }
        }



        // sets the current room when the client
        // makes a subscription
        function setCurrentRoom(room){
            currentRoom = room;
            $('.chat-rooms ul li.selected').removeClass('selected');
            $('.chat-rooms ul li[data-roomId="' + room + '"]').addClass('selected');
        }



        // handle the client messages
        /*
         *
         *
         *
         *
         *
         *
         *    HANDLE MESSAGE
         *
         *
         *
         *
         *
         */
        function handleMessage(){
            var message = $('.chat-widget-input').val().trim();
            if(message){

                nickname = getCurrentChatNickName();

                if (nickname){
                    // send the message to the server with the room name
                    socket.emit('chatmessage', {nickname: nickname, message: message, room: currentRoom });

                    sf1.EventBus.trigger('chat.initTranscript');
                    // display the message in the chat window
//                    insertMessage(nickname, message, true, true);
//                    $('.chat-widget-input').val('');
//                    $('.chat-widget-input').focus();
                }
                else{
                    sf1.log('posting requires a nickname - none was supplied: ' + message);
                }

            } else {
                shake('.chat', '.chat-widget-input', 'wobble', 'yellow');
            }
        }

        var getCurrentChatNickName = function(){
            var currentOwner;
            if (sf1.hasStorage){

                var currentUser = localStorage.getItem('currentAuthRoster');
                if (currentUser){
                    currentUser = JSON.parse(currentUser);
                    if (currentUser.owner){
                        currentOwner = currentUser.owner;
                    }
                }

            }
            return currentOwner;
        };
        // insert a message to the chat window, this function can be
        // called with some flags
        /*
         *
         *
         *
         *
         *
         *
         *
         *
         *
         * INSERT MESSAGE
         *
         *
         *
         *
         *
         *
         *
         * */
        function insertMessage(sender, message, showTime, isMe, isServer){
            var chatMessageModel = {};
            chatMessageModel.nickname = sender;
            chatMessageModel.message = message;
            chatMessageModel.messageTimeStamp = new Date();

            sf1.EventBus.trigger('chat.addNewChatMessage',[chatMessageModel,event]);

        }

        // return a short time format for the messages
        function getTime(){
            var date = new Date();
            return (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours()) + ':' +
                (date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes());
        }

        // just for animation
        function shake(container, input, effect, bgColor){
            if(!lockShakeAnimation){
                lockShakeAnimation = true;
                $(container).addClass(effect);
                $(input).addClass(bgColor);
                window.setTimeout(function(){
                    $(container).removeClass(effect);
                    $(input).removeClass(bgColor);
                    $(input).focus();
                    lockShakeAnimation = false;
                }, 1500);
            }
        }

        // after selecting a nickname we call this function
        // in order to init the connection with the server
        function connect(){
            // show connecting message
            // $('.chat-shadow .content').html('Connecting...');

            // creating the connection and saving the socket
            socket = io.connect(serverAddress);

            // now that we have the socket we can bind events to it
            bindSocketEvents();
        }













        function init(){

            sf1.log('Chat module init');


            var chatModuleContainer = $('script#ChatModuleDefaultTemplate').html();

            var template = _.template(chatModuleContainer);

            var templateData = {};

            var templateMarkup = template( templateData );
            $('.main-content-wrapper').append(templateMarkup);


            if (sf1.hasStorage){
                currentAuthRoster = getCurrentAuthRoster();
               // sf1.log('CURRENT AUTH ROSTER: ' + currentAuthRoster);
            }
            $('#InputChatTranscriptNewestFirst').on('change',function(event){
                if($(event.target).attr('checked')){
                    sf1.log('user preference change  newest at top ');
                    chatDirection = 'newest-at-top';

                }
                else{
                    sf1.log('user preference change  newest at bottom ');
                    chatDirection = 'newest-at-bottom';

                }
                sf1.EventBus.trigger('chat.changeChatPreference');
            });


            //ChatLib.init();
            sf1.EventBus.trigger('chat.initTranscript');

        }

        return {
            init:function(){
                return init();
            }
        };
    }
);