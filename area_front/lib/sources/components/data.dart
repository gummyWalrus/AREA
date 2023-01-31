class ConnectionData {
  late String? name, pseudo, logo, urlName;
  late bool loggedIn;
  ConnectionData(this.name, this.pseudo, this.logo);
  ConnectionData.fromJson(Map<String, dynamic> json) {
    name = json['service']['name'];
    logo = json['service']['logo'];
    urlName = json['service']['urlName'];
    loggedIn = json['loggedIn'];
    pseudo = json['pseudo'];
  }
}

class ActionData {
  late String name, id, logo;
  ActionData(this.name, this.id, this.logo);
  ActionData.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    id = json['_id'];
    logo = json['logo'];
  }
}

class ReactionData {
  late String name, id, logo;
  ReactionData(this.name, this.id, this.logo);
  ReactionData.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    id = json['_id'];
    logo = json['logo'];
  }
}

class ServiceData {
  late List actions, reactions;
  ServiceData(this.actions, this.reactions);
  ServiceData.fromJson(Map<String, dynamic> json) {
    actions = json['actions'];
    reactions = json['reactions'];
  }
}
