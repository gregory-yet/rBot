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
			this.wList = API.getWaitListPosition(id) == -1 ? API.getWaitListPosition(id) : API.getWaitListPosition(id) + 1;
			this.join = Date.now();
			rBot.users.listUser[id] = this;
		},
		newDc: function(id){
			this.id = id;
			this.time = Date.now();
			this.wList = rBot.users.getUser(id).wList;
			this.valid = true;
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
		move: function(un, unt, position){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == unt && position < 50){
					API.sendChat('[!move] [' + un + '] a modifié la position de ' + unt + ' dans la waitlist !');
					API.moderateMoveDJ(u[i].id, position);
				}
			}
		},
		kill: function(un){
			API.sendChat('[!kill] [' + un + '] a désactivé le bot ! :warning:');
			API.off(API.USER_JOIN);
			API.off(API.USER_LEAVE);
			API.off(API.CHAT);
			API.off(API.ADVANCE);
			rBot = {};
		},
		reload: function(un){
			API.sendChat('[!reload] [' + un + '] a rechargé le bot ! :warning:');
			API.off(API.USER_JOIN);
			API.off(API.USER_LEAVE);
			API.off(API.CHAT);
			API.off(API.ADVANCE);
			rBot = {};
			setTimeout(function(){$.getScript('https://cdn.rawgit.com/WayzRG/rBot/master/rBot.js');}, 500);
		},
		clearchat: function(un){
			var msg = $('div#chat-messages').children('div');
			for(var i in msg){
				if(msg.eq(i).data('cid')){
					cid = msg.eq(i).data('cid');
					rBot.deleteChat(cid);
				}
			}
			API.sendChat('[!clearchat] [' + un + '] a supprimé tout les messages ! :warning:');
		}
	},
	bouncer_cmd: {
		skip: function(un, position){
			API.sendChat('[!skip] [' + un + '] a passé la musique !');
			var current_dj = API.getDJ().id;
			if(position < 50){
				API.moderateForceSkip();
				setTimeout(function(){API.moderateAddDJ(current_dj);}, 1000);
				setTimeout(function(){API.moderateMoveDJ(current_dj, parseInt(position));}, 1500);
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
		kick: function(un, unt){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == unt){
					var username = u[i].username;
					var id = u[i].id;
					API.sendChat('[!kick] [' + un + '] a kick ' + username + ' de la room !');
					setTimeout(function(){API.moderateBanUser(id, 0, -1);}, 1000);
					setTimeout(function(){$('#users-button').click();$('.button.bans').click();setTimeout(function(){ $('.button.room').click(); $('#chat-button').click();}, 100);}, 2000);
					setTimeout(function(){API.moderateUnbanUser(id);}, 3500);
				}
			}
		},
		mute: function(un, unt){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == unt){
					var username = u[i].username;
					var id = u[i].id;
					API.sendChat('[!mute] [' + un + '] a mute ' + username + ' pendant 15 minutes !');
					API.moderateMuteUser(id, 1, API.MUTE.SHORT);
				}
			}
		},
		unmute: function(un, unt){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == unt){
					var username = u[i].username;
					var id = u[i].id;
					API.sendChat('[!unmute] [' + un + '] a unmute ' + username + ' !');
					$('#users-button').click();setTimeout(function(){$('.button.mutes').click();setTimeout(function(){$('.button.room').click();$('#chat-button').click();},500);}, 100);
					setTimeout(function(){API.moderateUnmuteUser(id);},800);
				}
			}
		},
		guideline: function(un){
			API.sendChat('[!guideline] [' + un + '] Voici la guideline (règles à respecter) pour le staff : http://goo.gl/8OQxix');
		},
		jointime: function(un, unt){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == unt){
					var ms = Date.now() - rBot.users.getUser(u[i].id).join,
					// http://stackoverflow.com/a/19700358
					seconds = parseInt((ms/1000)%60),
					minutes = parseInt((ms/(1000*60))%60),
					hours = parseInt((ms/(1000*60*60))%24);

					hours = (hours < 10) ? "0" + hours : hours;
					minutes = (minutes < 10) ? "0" + minutes : minutes;
					seconds = (seconds < 10) ? "0" + seconds : seconds;

					var time = hours + "h:" + minutes + "m:" + seconds + "s";
					API.sendChat('[!jointime] [' + un + '] L\'utilisateur ' + unt + ' est connecté depuis ' + time);
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
				if((Date.now() - rBot.users.getDc(id).time) < 600000 && (rBot.users.getDc(id).wList !== 50 || rBot.users.getDc(id).wList !== -1) && rBot.users.getDc(id).valid == true){
					API.sendChat('[!dc] [' + un + '] Voici ton ancienne place lors de la déconnexion : ' + rBot.users.getDc(id).wList);
					API.moderateAddDJ(id);
					setTimeout(function(){API.moderateMoveDJ(id, rBot.users.getDc(id).wList);}, 2000);
					rBot.users.listDc[id].valid = false;
				}
				else {
					API.sendChat('[!dc] [' + un + '] Tu es déconnecté depuis trop longtemps ou bien tu n\'étais pas dans la waitlist');
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
		},
		eta: function(un){
			var u = API.getUsers();
			for(var i in u){
				if(u[i].username == un){
					if(API.getWaitListPosition(u[i].id) !== -1){
						var username = u[i].username;
						var id = u[i].id;
						API.sendChat('[!eta] [' + un + '] Il te reste environ ' + Math.floor(API.getMedia().duration * 0.017) * API.getWaitListPosition(id) + ' minutes à attendre pour être le dj !');
					}
					else {
						API.sendChat('[!eta] [' + un + '] Tu n\'es pas dans la waitlist !');
					}
				}
			}
		}
	},
	deleteChat: function(id){
		$.ajax({url:'https://plug.dj/_/chat/'+id,type:'DELETE'});
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
				var cmd = cmds[0];
				var attr = data.message.substr(data.message.indexOf(cmds[1]));
				switch(cmd){
					// user_cmd
					case '!ping':
						rBot.deleteChat(data.cid);
						API.sendChat('[!ping] [' + data.un + '] Pong !');
						break;
					case '!theme':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.theme(data.un);
						break;
					case '!rules':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.rules(data.un);
						break;
					case '!op':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.op(data.un);
						break;
					case '!emoji':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.emoji(data.un);
						break;
					case '!commands':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.commands(data.un);
						break;
					case '!adblock':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.adblock(data.un);
						break;
					case '!support':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.support(data.un);
						break;
					case '!pic':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.pic(data.un);
						break;
					case '!link':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.link(data.un);
						break;
					case '!dc':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.dc(data.uid, data.un);
						break;
					case '!cookie':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.cookie(data.un, attr);
						break;
					case '!kiss':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.kiss(data.un, attr);
						break;
					case '!eta':
						rBot.deleteChat(data.cid);
						rBot.user_cmd.eta(data.un);
						break;


					// rdj_cmd
					case '!rdj':
						if(API.hasPermission(data.uid, API.ROLE.DJ)){
							rBot.deleteChat(data.cid);
							rBot.rdj_cmd.rdj(data.un);
						}
						break;
					case '!staff':
						if(API.hasPermission(data.uid, API.ROLE.DJ)){
							rBot.deleteChat(data.cid);
							rBot.rdj_cmd.staff(data.un);
						}
						break;
					case '!tuto':
						if(API.hasPermission(data.uid, API.ROLE.DJ)){
							rBot.deleteChat(data.cid);
							rBot.rdj_cmd.tuto(data.un);
						}
						break;
					case '!lothelp':
						if(API.hasPermission(data.uid, API.ROLE.DJ)){
							rBot.deleteChat(data.cid);
							rBot.rdj_cmd.lothelp(data.un);
						}
						break;
					case '!dev':
						if(API.hasPermission(data.uid, API.ROLE.DJ)){
							rBot.deleteChat(data.cid);
							rBot.rdj_cmd.dev(data.un);
						}
						break;


					// bouncer_cmd
					case '!unlock':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.unlock(data.un);
						}
						break;
					case '!skip':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.skip(data.un, attr);
						}
						break;
					case '!remove':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.remove(data.un, attr);
						}
						break;
					case '!add':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.add(data.un, attr);
						}
						break;
					case '!kick':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.kick(data.un, attr);
						}
						break;
					case '!mute':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.mute(data.un, attr);
						}
						break;
					case '!unmute':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.unmute(data.un, attr);
						}
						break;
					case '!guideline':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.guideline(data.un);
						}
						break;
					case '!jointime':
						if(API.hasPermission(data.uid, API.ROLE.BOUNCER)){
							rBot.deleteChat(data.cid);
							rBot.bouncer_cmd.jointime(data.un, attr);
						}
						break;

					// manager_cmd
					case '!move':
						if(API.hasPermission(data.uid, API.ROLE.MANAGER)){
							rBot.deleteChat(data.cid);
							rBot.manager_cmd.move(data.un, attr.substr(0, attr.length - 1).trim(), attr.substr(attr.length - 1).trim());
						}
						break;
					case '!kill':
						if(API.hasPermission(data.uid, API.ROLE.MANAGER)){
							rBot.deleteChat(data.cid);
							rBot.manager_cmd.kill(data.un);
						}
					case '!reload':
						if(API.hasPermission(data.uid, API.ROLE.MANAGER)){
							rBot.deleteChat(data.cid);
							rBot.manager_cmd.reload(data.un);
						}
					case '!clearchat':
						if(API.hasPermission(data.uid, API.ROLE.MANAGER)){
							rBot.deleteChat(data.cid);
							rBot.manager_cmd.clearchat(data.un);
						}
					break;

					default:
						rBot.deleteChat(data.cid);
						break;
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
		API.on(API.ADVANCE, function(){
			var u = rBot.users.listUser;
			for(var i in u){
				u[i].wList = API.getWaitListPosition(u[i].id) == -1 ? API.getWaitListPosition(u[i].id) : API.getWaitListPosition(u[i].id) + 1;
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
