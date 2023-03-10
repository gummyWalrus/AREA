const axios = require('axios').default;

class Service {
    constructor(name: string, logo: string) {
        this.name = name;
        this.logo = logo;
    }
    name: string;
    logo: string;
}

class Action {
    constructor (name: string, description: string, service: string, dataScheme: object) {
        this.name = name;
        this.description = description;
        this.service = service;
        this.dataScheme = dataScheme;
    }
    name: string;
    description: string;
    service: string;
    dataScheme: object;
}

class Reaction {
    constructor (name: string, description: string, service: string, dataScheme: object) {
        this.name = name;
        this.description = description;
        this.service = service;
        this.dataScheme = dataScheme;
    }
    name: string;
    description: string;
    service: string;
    dataScheme: object;
}

const url = 'http://localhost:8080/'
const admin_token = "B8HUTQAESO5W9CMVTRYJ";

async function registerService(data : Service)
{
    return await axios.post(url + 'services', data, { headers : { token : admin_token } }).catch((err) => { console.error(err); return null; });
}

async function registerAction(data : Action) {
    return await axios.post(url + 'actions', data, { headers : { token : admin_token } }).catch((err) => {console.error(err); return null;})
}

async function registerReaction(data : Reaction) {
    return await axios.post(url + 'reactions', data, { headers : { token : admin_token } }).catch((err) => {console.error(err); return null;})
}


async function servTwitter() {
    registerService(new Service("Twitter", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4n_urpJ9XpwOTdzBVbGvactwHrPagYQrTJPYjxfxLGkSyu7nJZVqRVGAeohnPgKMrnKE&usqp=CAU"))
    .then((res) => {
        registerReaction(new Reaction("Twitter Tweet", "Effectue un tweet sur Twitter", res.data._id, {
            username: {
                type: "string",
                description: "Le nom d'utilisateur de l'auteur du tweet"
            },
            message: {
                type: "string",
                description: "Le contenu du tweet"
            }
        }))
    })
}

async function servGmail() {
    registerService(new Service("Gmail", "https://cdn-icons-png.flaticon.com/512/281/281769.png"))
    .then((res) => {
        registerReaction(new Reaction("Gmail Mail", "Envoie un mail via Gmail", res.data._id, {
            email: {
                type: "string",
                description: "L'adresse qui recevra le mail"
            },
            objet: {
                type: "string",
                description: "L'objet du mail",
            },
            message: {
                type: "string",
                description: "Le contenu du mail"
            }
        }))
    })
}

async function servCalendar() {
    registerService(new Service("Calendar", "https://cdn.icon-icons.com/icons2/2631/PNG/512/google_calendar_new_logo_icon_159141.png"))
        .then((res) => {
            registerReaction(new Reaction("Calendar Event", "Cr??er un Event via Calendar", res.data._id, {
                summary: {
                    type: "string",
                    description: "Le titre de l'??venement"
                },
                description: {
                    type: "string",
                    description: "La description de l'??venement"
                },
                location: {
                    type: "string",
                    description: "Le lieu de l'??venement"
                },
                startDate: {
                    type: "date",
                    description: "la date du jour, heure et minute du d??but de l'event"
                },
                endDate: {
                    type: "date",
                    description: "la date du jour, heure et minute de la fin de l'event"
                }
            }))
        })
}

async function servYoutube() {
    registerService(new Service("Youtube", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/YouTube_social_white_squircle.svg/2048px-YouTube_social_white_squircle.svg.png"))
        .then((res) => {
            registerReaction(new Reaction("Youtube Upload Video", "Upload une video via Youtube", res.data._id, {
                title: {
                    type: "string",
                    description: "Le titre de la video"
                },
                description: {
                    type: "string",
                    description: "La description de la video"
                },
                privacyStatus: {
                    type: "choice",
                    description: "La visibilit?? de la video",
                    choices: [
                        {name: "publique", value: "public"},
                        {name: "priv??e", value: "private"},
                    ]
                }
            }))
        })
}

async function servSMS() {
    registerService(new Service("SMS", "https://thumbs.dreamstime.com/b/ic-ne-de-causerie-sms-bulle-commentaires-communication-d-entretien-appel-groupe-bulles-la-parole-les-que-commente-des-dirigent-l-148080907.jpg"))
        .then((res) => {
            registerReaction(new Reaction("Send SMS", "Envoyer un message via SMS", res.data._id, {
                to: {
                    type: "string",
                    description: "Le num??ro de la personne ?? qui envoyer"
                },
                message: {
                    type: "string",
                    description: "Le message a envoyer"
                }
            }))
        })
}

async function servTelegram() {
    registerService(new Service("Telegram", "https://seeklogo.com/images/T/telegram-logo-6E3A371CF2-seeklogo.com.png"))
        .then((res) => {
            registerReaction(new Reaction("Send SMS", "Envoyer un message dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                message: {
                    type: "string",
                    description: "Le message a envoyer"
                }
            }));
            registerReaction(new Reaction("Send Animation", "Envoyer un du GIF dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                animation: {
                    type: "string",
                    description: "Le lien du GIF"
                }
            }));
            registerReaction(new Reaction("Send Photo", "Envoyer une photo dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                photo: {
                    type: "string",
                    description: "Le lien de la photo"
                }
            }));
            registerReaction(new Reaction("Send Document", "Envoyer un document dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                document: {
                    type: "string",
                    description: "Le lien du document"
                }
            }));
            registerReaction(new Reaction("Send Video", "Envoyer une video dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                video: {
                    type: "string",
                    description: "Le lien de la video"
                }
            }));
            registerReaction(new Reaction("Set Chat Photo", "set une photo dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                photo: {
                    type: "string",
                    description: "Le lien de la photo"
                }
            }));
            registerReaction(new Reaction("Set Chat Title", "set un titre dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                title: {
                    type: "string",
                    description: "Le titre du groupe"
                }
            }));
            registerReaction(new Reaction("Set Chat Description", "set une description dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                description: {
                    type: "string",
                    description: "La description du groupe"
                }
            }));
            registerReaction(new Reaction("Set Chat Sticker Set", "set un sticket set dans un groupe via un Bot Telegram", res.data._id, {
                groupeId: {
                    type: "string",
                    description: "L'id du groupe telegram"
                },
                stickerSetName: {
                    type: "string",
                    description: "Le nom du sticker set"
                }
            }));
        });
}

async function servDiscord() {
    registerService(new Service("Discord", "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png"))
    .then((res) => {
        registerReaction(new Reaction("Discord ChannelMsg", "Envoie un message sur un channel Discord", res.data._id,
        {
            channel: {
                type: "choice",
                description: "un choix s??lectif entre tous les channel Discord de vos serveurs sous la forme <nom du serveur>#<nom du channel> E.G AREA#g??n??ral", 
                choices : [] 
            },
            message: {
                type: "string",
                description: "Le contenu du message"
            }
        }));
    });
}

async function servGithub() {
    registerService(new Service("Github", "https://cdn-icons-png.flaticon.com/512/25/25231.png")).then((res) => {
        registerAction(new Action("Github Push", "Un push ?? ??t?? effectu??", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t cibl?? par le push"
            },
            repository: {
                type: "string",
                description: "Le d??p??t cibl?? par le push"
            }
        }))
        registerAction(new Action("Github Star", "Une ??toile ?? ??t?? ajout??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t cibl?? par l'??toile"
            },
            repository: {
                type: "string",
                description: "Le d??p??t cibl?? par l'??toile"
            }
        }))
        registerAction(new Action("Github Unstar", "Une ??toile ?? ??t?? enlev??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t cibl?? par l'??toile"
            },
            repository: {
                type: "string",
                description: "Le d??p??t cibl?? par l'??toile"
            }
        }))
        registerAction(new Action("Github Fork", "Un fork ?? ??t?? cr????", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t fork??"
            },
            repository: {
                type: "string",
                description: "Le d??p??t fork??"
            }
        }))
        registerAction(new Action("Github CreateBranch", "Une branche ?? ??t?? cr????e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? la branche est cr????e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? la branche est cr????e"
            }
        }))
        registerAction(new Action("Github CreateTag", "Un tag ?? ??t?? cr????", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? le tag est cr????"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? le tag est cr????"
            }
        }))
        registerAction(new Action("Github OpenIssue", "Une issue ?? ??t?? ouverte", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est ouverte"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est ouverte'"
            }
        }))
        registerAction(new Action("Github CloseIssue", "Une issue ?? ??t?? ferm??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est ferm??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est ferm??e'"
            }
        }))
        registerAction(new Action("Github EditIssue", "Une issue ?? ??t?? modifi??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est modifi??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est modifi??e"
            }
        }))
        registerAction(new Action("Github DeleteIssue", "Une issue ?? ??t?? effac??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est effac??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est effac??e"
            }
        }))
        registerAction(new Action("Github AssignIssue", "Une issue ?? ??t?? assign??e ?? un utilisateur", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est assign??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est assign??e"
            }
        }))
        registerAction(new Action("Github UnassignIssue", "Une issue ?? ??t?? desassign??e d'un utilisateur", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est desassign??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est desassign??e"
            }
        }))
        registerAction(new Action("Github PinIssue", "Une issue ?? ??t?? ??pingl??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est ??pingl??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est ??pingl??e"
            }
        }))
        registerAction(new Action("Github UnpinIssue", "Une issue ?? ??t?? des??pingl??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est des??pingl??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est des??pingl??e"
            }
        }))
        registerAction(new Action("Github LockIssue", "Une issue ?? ??t?? verouill??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est verouill??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est verouill??e"
            }
        }))
        registerAction(new Action("Github UnlockIssue", "Une issue ?? ??t?? deverouill??e", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est deverouill??e"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est deverouill??e"
            }
        }))
        registerAction(new Action("Github ReopenIssue", "Une issue ?? ??t?? r??ouverte", res.data._id, {
            owner: {
                type: "string",
                description: "Le propri??taire du d??p??t o?? l'issue est r??ouverte"
            },
            repository: {
                type: "string",
                description: "Le d??p??t o?? l'issue est r??ouverte"
            }
        }))
        
    })
}


axios.delete(url + 'services/all', {headers: {token : admin_token}}).then((res) => {
    servTwitter();
    servGithub();
    servGmail();
    servCalendar();
    servYoutube();
    servSMS();
    servTelegram();
    servDiscord();
});
