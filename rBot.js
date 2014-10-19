/*
The MIT License (MIT)
Copyright (c) 2014 Wayz Dev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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
			setTimeout(function(){rBot.users.removeDc(id);}, 100000);
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
		skip: function(un, position){
			API.sendChat('[!skip] [' + un + '] a passé la musique !');
			var current_dj = API.getDJ().id;
			if(position < 50){
				API.moderateForceSkip();
				setTimeout(function(){API.moderateAddDJ(current_dj);}, 200);
				setTimeout(function(){API.moderateMoveDJ(current_dj, parseInt(position));}, 400);
			}
			else{
				API.moderateForceSkip();
			}
		},
		unlock: function(un){
			API.sendChat('[!unlock] [' + un + '] a débloqué la waitlist !');
			API.moderateLockWaitList(false, false);
		},
		remove: function(un, unt){
			var wl = API.getWaitList();
			for(var i in wl){
				if(wl[i].username == unt){
					API.sendChat('[!remove] [' + un + '] a retiré ' + unt + ' de la waitlist !');
					API.moderateRemoveDJ(wl[i].id);
				}
			}
		},
		add: function(un, unt){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == unt){
					API.sendChat('[!add] [' + un + '] a ajouté ' + unt + ' dans la waitlist !');
					API.moderateAddDJ(u[i].id);
				}
			}
		},
		move: function(un, unt, position){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == unt && position < 50){
					API.sendChat('[!move] [' + un + '] a modifié la position de ' + unt + ' dans la waitlist !');
					API.moderateMoveDJ(u[i].id, position);
				}
			}
		},
		kick: function(un, unt){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == unt){
					var username = u[i].username;
					var id = u[i].id;
					API.sendChat('[!kick] [' + un + '] a kick ' + username + ' de la room !');
					setTimeout(function(){API.moderateBanUser(id, 0, -1);}, 1000);
					$('#users-button').click();$('.button.bans').click();setTimeout(function(){ $('.button.room').click(); $('#chat-button').click();}, 100);
					setTimeout(function(){API.moderateUnbanUser(id);}, 3000);
				}
			}
		}
	},
	rdj_cmd: {
		rdj: function(un){
			API.sendChat('[!rdj] [' + un + '] Pour devenir Resident DJ, il faut passer des musiques appréciées par la communauté, vous serez prévenu par un membre du staff');
		},
		staff: function(un){
			API.sendChat('[!staff] [' + un + '] Pour devenir staff, il faut respecter les règles, être sérieux mais aussi détendu, et surtout être actif ! Vous serez prévenu par un membre du staff :)');
		},
		tuto: function(un){
			API.sendChat('[!tuto] [' + un + '] Voici une explication de plug.dj en une image : http://i.imgur.com/et4qYhs.jpg');
		},
		lothelp: function(un){
			API.sendChat('[!lothelp] [' + un + '] La loterie est un jeu qui permet de booster une personne en première position dans la liste d\'attente, aléatoirement. Si vous gagnez, tapez !loterie');
		},
		dev: function(un){
			API.sendChat('[!dev] [' + un + '] Le développeur de ce bot est : WAYZ');
		}
	},
	user_cmd: {
		theme: function(un){
			API.sendChat('[!theme] [' + un + '] Tout les styles de musiques sont autorisés sauf : La country, le troll, le classique et les sons à caractères racistes !');
		},
		rules: function(un){
			API.sendChat('[!rules] [' + un + '] Voici les règles à respecter : http://goo.gl/Arz6Ax');
		},
		op: function(un){
			API.sendChat('[!op] [' + un + '] Voici la liste des musiques interdites : http://goo.gl/eiRdQK');
		},
		emoji: function(un){
			API.sendChat('[!emoji] [' + un + '] Voici la liste des smileys : http://goo.gl/AKDkeo');
		},
		commands: function(un){
			API.sendChat('[!commands] [' + un + '] Voici la liste des commandes : http://goo.gl/t43eFj');
		},
		adblock: function(un){
			API.sendChat('[!adblock] [' + un + '] Voici l\'add-on adblock qui vous permet de bloquer les publicités ! https://adblockplus.org/fr/');
		},
		support: function(un){
			API.sendChat('[!support] [' + un + '] Voici l\'adresse du support plug.dj : http://support.plug.dj/');
		},
		pic: function(un){
			var media = API.getMedia();
			if(media.format === 1){
				var link = "http://i.ytimg.com/vi/" + media.cid + "/maxresdefault.jpg";
				API.sendChat('[!pic] [' + un + '] Voici le lien de l\'image : ' + link);
			}
		},
		link: function(un){
			var media = API.getMedia();
			if(media.format === 1){
				var base = "http://youtube.com/watch?v=";
				var link = base + media.cid;
				API.sendChat('[!link] [' + un + '] Voici le lien de la musique : ' + link);
			}
			else if(media.format === 2){
				SC.get('/tracks/'+media.cid,function(sound){
					API.sendChat('[!link] [' + un + '] Voici le lien de la musique : ' + sound.permalink_url);
				});
			}
		},
		dc: function(id, un){
			if(rBot.users.getDc(id)){
				if((Date.now() - rBot.users.getDc(id).time) < 600000){
					API.sendChat('[!dc] [' + un + '] Voici ton ancienne place lors de la déconnexion : ' + rBot.users.getDc(id).wList);
					API.moderateAddDJ(id);
					setTimeout(function(){API.moderateMoveDJ(id, rBot.users.getDc(id).wList);}, 1000);
				}
			}
			else{
				API.sendChat('[!dc] [' + un + '] Je ne t\'ai pas vu te déconnecter !');
			}
		},
		cookie: function(un, unt){
			API.sendChat('[!cookie] [' + unt + '] @' + un + ' vous a envoyé un cookie !');
		},
		kiss: function(un, unt){
			API.sendChat('[!kiss] [' + unt + '] @' + un + ' vous a envoyé un bisous !');
		}
		// Cookie
		// Kiss
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
						// user_cmd
						case '!ping':
							API.moderateDeleteChat(data.cid);
							API.sendChat('[!ping] [' + data.un + '] Pong !');
							break;
						case '!theme':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.theme(data.un);
							break;
						case '!rules':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.rules(data.un);
							break;
						case '!op':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.op(data.un);
							break;
						case '!emoji':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.emoji(data.un);
							break;
						case '!commands':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.commands(data.un);
							break;
						case '!adblock':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.adblock(data.un);
							break;
						case '!support':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.support(data.un);
							break;
						case '!pic':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.pic(data.un);
							break;
						case '!link':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.link(data.un);
							break;
						case '!dc':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.dc(data.uid, data.un);
							break;

						// rdj_cmd
						case '!rdj':
							if(API.hasPermission(data.uid, API.ROLE.DJ)){
								API.moderateDeleteChat(data.cid);
								rBot.rdj_cmd.rdj(data.un);
							}
							break;
						case '!staff':
							if(API.hasPermission(data.uid, API.ROLE.DJ)){
								API.moderateDeleteChat(data.cid);
								rBot.rdj_cmd.staff(data.un);
							}
							break;
						case '!tuto':
							if(API.hasPermission(data.uid, API.ROLE.DJ)){
								API.moderateDeleteChat(data.cid);
								rBot.rdj_cmd.tuto(data.un);
							}
							break;
						case '!lothelp':
							if(API.hasPermission(data.uid, API.ROLE.DJ)){
								API.moderateDeleteChat(data.cid);
								rBot.rdj_cmd.lothelp(data.un);
							}
							break;
						case '!dev':
							if(API.hasPermission(data.uid, API.ROLE.DJ)){
								API.moderateDeleteChat(data.cid);
								rBot.rdj_cmd.dev(data.un);
							}
							break;

						// bouncer_cmd
						case '!unlock':
							if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
								API.moderateDeleteChat(data.cid);
								rBot.bouncer_cmd.unlock(data.un);
							}
							break;
						default:
							API.moderateDeleteChat(data.cid);
							break;
					}
				}
				else if(cmds.length == 2){
					var cmd = cmds[0];
					var attr = cmds[1];
					switch(cmd){
						// user_cmd
						case '!cookie':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.cookie(data.un, cmds[1]);
							break;
						case '!kiss':
							API.moderateDeleteChat(data.cid);
							rBot.user_cmd.kiss(data.un, cmds[1]);
							break;

						// bouncer_cmd
						case '!skip':
							if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
								API.moderateDeleteChat(data.cid);
								rBot.bouncer_cmd.skip(data.un, cmds[1]);
							}
							break;
						case '!remove':
							if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
								API.moderateDeleteChat(data.cid);
								rBot.bouncer_cmd.remove(data.un, cmds[1]);
							}
							break;
						case '!add':
							if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
								API.moderateDeleteChat(data.cid);
								rBot.bouncer_cmd.add(data.un, cmds[1]);
							}
							break;
						case '!kick':
							if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
								API.moderateDeleteChat(data.cid);
								rBot.bouncer_cmd.kick(data.un, cmds[1]);
							}
							break;
						default:
							API.moderateDeleteChat(data.cid);
							break;
					}
				}
				else if(cmds.length == 3){
					var cmd = cmds[0];
					var attr = cmds[1];
					var attr2 = cmds[2];
					switch(cmd){
						// bouncer_cmd
						case '!move':
							API.moderateDeleteChat(data.cid);
							rBot.bouncer_cmd.move(data.un, cmds[1], cmds[2]);
							break;
						default:
							API.moderateDeleteChat(data.cid);
							break;
					}
				}
			}
			else if(data.message.indexOf('@') !=-1){
				for(var i in rBot.users.getUser()){
					if(data.message.indexOf(rBot.users.getUser(i).username)!=-1){
						user = rBot.users.getUser(i);
						if(user.afk){
							API.sendChat('[' + user.username + '] est actuellement inactif !');
						}
					}
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
			API.sendChat('[rBot] est maintenant en marche ! :)')
		}
		else{
			API.sendChat('[rBot] a besoin d\'être au minimum manager pour fonctionner !');
		}
	}
};

rBot.init();
