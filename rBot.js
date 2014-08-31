var rBot = {
	users: {
		newUser: function(id, username){
			this.id = id;
			this.username = username;
			rBot.users.listUser[id] = this;
		},
		removeUser: function(id){
			delete rBot.users.listUser[id];
			delete id;
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
		listUser: {}
	},
	cohost_cmd: {

	},
	manager_cmd: {

	},
	bouncer_cmd: {

	},
	user_cmd: {
		theme: function(){
			API.sendChat('Tout les styles de musiques sont autorisÃ©s sauf : La country, le classique et les sons Ã  caractÃ¨res racistes !');
		},
		rules: function(){
			API.sendChat('Voici les rÃ¨gles Ã  respecter : http://goo.gl/Arz6Ax');
		},
		op: function(){
			API.sendChat('Voici la liste des musiques interdites : http://goo.gl/eiRdQK');
		},
		emoji: function(){
			API.sendChat('Voici la liste des smileys : http://goo.gl/AKDkeo');
		},
		commands: function(){
			API.sendChat('Voici la liste des commandes : http://NaN.fr/')
		},
		adblock: function(){
			API.sendChat('Voici l\'add-on adblock qui vous permet de bloquer les publicitÃ©s ! https://adblockplus.org/fr/firefox');
		},
		support: function(){
			API.sendChat('Voici l\'adresse du support plug.dj : http://support.plug.dj/');
		},
		pic: function(){
			var media = API.getMedia();
			if(media.format === 1){
				var link = "http://i.ytimg.com/vi/" + media.cid + "/maxresdefault.jpg";
				API.sendChat('Voici le lien de l\'image : ' + link);
			}
		},
		link: function(){
			var media = API.getMedia();
			if(media.format === 1){
				var base = "http://youtube.com/watch?v=";
				var link = base + media.cid;
				API.sendChat('Voici le lien de la musique : ' + link);
			}
			else if(media.format === 2){
				SC.get('/tracks/'+media.cid,function(sound){
					API.sendChat('Voici le lien de la musique : ' + sound.permalink_url);
				});
			}
		}
	}
};
