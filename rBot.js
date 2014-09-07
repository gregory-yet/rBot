var rBot = {
	users: {
		newUser: function(id, username){
			this.id = id;
			this.username = username;
			this.wList = API.getWaitListPosition(id);
			rBot.users.listUser[id] = this;
		},
		newDc: function(id){
			this.id = id;
			this.time = Date.now();
			this.wList = rBot.users.getUser(id).wList;
			rBot.users.listDc[id] = this;
			setTimeout(function(){rBot.users.removeDc(id)}, 100000);
		},
		removeUser: function(id){
			delete rBot.users.listUser[id];
		},
		removeDc: function(id){
			delete rBot.users.listDc[id];
		},
		getUser: function(id){
			for(var i in rBot.users.listUser){
				if(id){
					if(rBot.users.listUser[i].id == id){
						return rBot.users.listUser[i];
					}
				}
				else {
					return rBot.users.listUser;
				}
			}
		},
		getDc: function(id){
			for(var i in rBot.users.listDc){
				if(id){
					if(rBot.users.listDc[i].id == id){
						return rBot.users.listDc[i];
					}
				}
				else {
					return rBot.users.listDc;
				}
			}
		},
		listUser: {},
		listDc: {}
	},
	cohost_cmd: {

	},
	manager_cmd: {

	},
	bouncer_cmd: {

	},
	user_cmd: {
		theme: function(){
			API.sendChat('[!theme] Tout les styles de musiques sont autorisés sauf : La country, le troll, le classique et les sons à caractères racistes !');
		},
		rules: function(){
			API.sendChat('[!rules] Voici les règles à respecter : http://goo.gl/Arz6Ax');
		},
		op: function(){
			API.sendChat('[!op] Voici la liste des musiques interdites : http://goo.gl/eiRdQK');
		},
		emoji: function(){
			API.sendChat('[!emoji] Voici la liste des smileys : http://goo.gl/AKDkeo');
		},
		commands: function(){
			API.sendChat('[!commands] Voici la liste des commandes : http://NaN.fr/');
		},
		adblock: function(){
			API.sendChat('[!adblock] Voici l\'add-on adblock qui vous permet de bloquer les publicités ! https://adblockplus.org/fr/');
		},
		support: function(){
			API.sendChat('[!support] Voici l\'adresse du support plug.dj : http://support.plug.dj/');
		},
		pic: function(){
			var media = API.getMedia();
			if(media.format === 1){
				var link = "http://i.ytimg.com/vi/" + media.cid + "/maxresdefault.jpg";
				API.sendChat('[!pic] Voici le lien de l\'image : ' + link);
			}
		},
		link: function(){
			var media = API.getMedia();
			if(media.format === 1){
				var base = "http://youtube.com/watch?v=";
				var link = base + media.cid;
				API.sendChat('[!link] Voici le lien de la musique : ' + link);
			}
			else if(media.format === 2){
				SC.get('/tracks/'+media.cid,function(sound){
					API.sendChat('[!link] Voici le lien de la musique : ' + sound.permalink_url);
				});
			}
		},
		dc: function(id){
			if(rBot.users.getDc(id)){
				if((Date.now() - rBot.users.getDc(id).time) < 600000){
					API.sendChat('Voici ton ancienne place lors de la déconnexion : ' + rBot.users.getDc(id).wList);
					API.moderateAddDJ(id);
					setTimeout(function(){API.moderateMoveDJ(id, rBot.users.getDc(id).wList);}, 1000);
				}
			}
			else{
				API.sendChat('Je ne t\'ai pas vu te déconnecter !');
			}
		}
	},
	api_listener: function(){
		API.on(API.USER_JOIN, function(usr){
			new rBot.users.newUser(usr.id, usr.username);
		});
		API.on(API.USER_LEAVE, function(usr){
			new rBot.users.newDc(usr.id);
			rBot.users.removeUser(usr.id);
		});
		API.on(API.CHAT, function(data){
			if(data.message.indexOf('!') == 0){
				var cmds = data.message.split(' ');
				if(cmds.length == 1){
					var cmd = cmds[0];
					switch(cmd){
						case '!theme':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.theme();
							break;
						case '!rules':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.rules();
							break;
						case '!op':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.op();
							break;
						case '!emoji':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.emoji();
							break;
						case '!commands':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.commands();
							break;
						case '!adblock':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.adblock();
							break;
						case '!support':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.support();
							break;
						case '!pic':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.pic();
							break;
						case '!link':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.link();
							break;
						case '!dc':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.dc(data.uid);
							break;
						default:
							API.moderateDeleteChat(data.cid);
							break;
					}
				}
				if(cmds.length == 2){
					API.sendChat('Commande avec attribut ' + cmds[0] + ' | ' + cmds[1]);
				}
			}
		});
	},
	init: function(){
		if(API.getUser().role >= 3){
			for(var i in API.getUsers()){
				new rBot.users.newUser(API.getUsers()[i].id, API.getUsers()[i].username);
			}
			rBot.api_listener();
		}
		else{
			API.sendChat('J\'ai besoin d\'être au minimum manager pour fonctionner !');
		}
	}
};

rBot.init();
