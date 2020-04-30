var Ardublockly = Ardublockly || {};
Ardublockly.LOCALISED_TEXT = {
  translationLanguage: "Français",
  title: "Kniwwelino",
  blocks: "Blocs",
  /* Menu */
  tutorial: "Tutoriel",
  open: "Ouvrir",
  save: "Enregistrer",
  deleteAll: "Tout supprimer",
  settings: "Réglages",
  documentation: "Documentation",
  reportBug: "Signaler un bug",
  examples: "Exemples",
  simple: " simple",
  advanced: " étendu",
  /* Tutorial */
  tutorialBrowserSupportErrorTitle: "Votre navigateur n'est pas supporté !",
  tutorialBrowserSupportError: "Votre navigateur semble trop vieux, merci de le mettre à jour ou d'en essayer un autre",
  tutorialMenuTitle: "Choisir un tutoriel",
  tutorialMenuListLoading: "chargement de la liste…",
  tutorialError: "Erreur inattendue",
  tutorialDataAccessError: "Impossible d'accéder aux données du tutoriel",
  tutorialNotEnoughDataError: "Données insuffisantes",
  tutorialExpandBt: "Tutoriel",
  tutoStepTitle: "Etape : ",
  tutoValidateBtTitle: "Valider",
  tutoGoodAnswer: "BONNE REPONSE",
  tutoAnalyseResultTitle: "Résultat d'analyse : ",
  tutoAnalyseResultIncomplete: "incomplet",            
  tutoAnalyseResultFeedbackRightBlocks: "Blocs corrects : %s / %s",
  tutoAnalyseResultFeedbackCorrectOrder: "Ordre correct : %s",
  tutoAnalyseResultFeedbackCorrectSettings: "Valeurs correctes : %s / %s",
  tutoAnalyseResultFeedbackCorrectOrderYes: "oui",
  tutoAnalyseResultFeedbackCorrectOrderNo: "non",
  tutoAnalyseResultResponseIntro: "Votre réponse contient :",
  tutoAnalyseResultStillExtraBlocks: "Blocs en trop : %s",
  tutoTutoEnded: "Bravo, vous avez terminé ce tutoriel !",
  tutoTutoEndedNextOne: "Autre tutoriel",
  tutoStepEnded: "Bravo, vous avez terminé cette étape !",
  tutoStepHardwareTest: "Testez votre programme :",
  tutoStepEndedNextOne: "Etape suivante",                
  tutoIntroStepSidebar: "Suivez les instructions affichées dans le volet de gauche",
  tutoIntroStepToolbox: "Prenez les blocs dont vous avez besoin dans la boîte à outils",
  tutoIntroStepWorkspace: "Agencez vos blocs dans l'espace de travail",
  tutoIntroStepAnalysis: "Obtenez une analyse de votre travail en cliquant sur ce bouton",
  tutoIntroStepCompile: "Transférez et tester votre programme sur votre Kniwwelino",
  tutoIntroTooltipDone: "Terminer",
  tutoIntroTooltipNext: "Suivant",
  tutoIntroTooltipBack: "Retour",
  tutoIntroTooltipSkip: "Passer",
  /* Settings */
  compilerLocation: "Emplacement du compilateur",
  compilerLocationDefault: "",
  sketchFolder: "Dossier Sketch",
  sketchFolderDefault: "Dossier Sketch inconnu",
  arduinoBoard: "Carte Arduino",
  arduinoBoardDefault: "Carte Arduino inconnu",
  comPort: "Port COM",
  comPortDefault: "Port COM inconnu",
  defaultIdeButton: "Bouton IDE par défaut",
  defaultIdeButtonDefault: "Options IDE inconnu",
  language: "Langue",
  languageDefault: "Langue inconnu",
  sketchName: "Nom du Sketch",
  /* Arduino console output */
  arduinoOpMainTitle: "Sortie Arduino IDE",
  arduinoOpWaiting: "Attente de la sortie IDE...",
  arduinoOpUploadedTitle: "A envoyé avec succès le message de téléchargement à Kniwwelino",
  arduinoOpVerifiedTitle: "Sketch vérifié avec succès",
  arduinoOpOpenedTitle: "Skecth ouvert dans IDE",
  arduinoOpOpenedBody: "Le Sketch doit être chargé dans Arduino IDE",
  arduinoOpErrorUpVerTitle: "Une erreur est survenue",
  arduinoOpErrorSketchTitle: "Aucune erreur.",
  arduinoOpErrorFlagTitle: "La construction ou le chargement a échoué",
  arduinoOpErrorFlagPrefTitle: "Sketch introuvable",
  arduinoOpErrorIdeDirTitle: "Argument de la ligne de commande invalide",
  arduinoOpErrorIdeDirBody: "Préférence changé pour 'get-pref', le nom n'existe pas.",
  arduinoOpErrorIdeOptionTitle: "Pas clair mais Arduino IDE rencontre des erreurs avec ça.",
  arduinoOpErrorIdeOptionBody: "Erreur de code inattendue de Arduino IDE",
  arduinoOpErrorIdePortTitle: "Le fichier Sketch n'a pu être créé",
  arduinoOpErrorIdePortBody: "Chemin d'accès local invalide pour créer le fichier Sketch",
  arduinoOpErrorIdeBoardTitle: "Impossible de trouver Arduino IDE"+
                               "Le répertoire du compilateur n'a pas été correctement établi.<br>" +
                               "Vérifier dans les paramètres que le chemin d'accès est correct.",
  arduinoOpErrorIdeBoardBody: "Que devons-nous faire avec le Sketch ?<br>" +
                              "L'option de démarrage de IDE n'a pas été établi.<br>" +
                              "Merci de choisir une option IDE dans les paramètres.",
  arduinoOpErrorIdContext_55: "Port Série indisponible<br>" +
                              "Le Port Série est inaccessible.<br>" +
                              "Vérifiez que le Kniwwelino est correctement branché à l'ordinateur et sélectionnez le Port Série dans les paramètres.",
  arduinoOpErrorIdContext_56: "Carte Arduino inconnue<br>" +
                              "La carte Kniwwelino n'a pas été configurée.<br>" +
                              "Merci de sélectionner la carte Kniwwelino appropriée dans les paramètres.",
  arduinoOpErrorIdContext_52: "Erreur inatendue du serveur.",
  arduinoOpErrorIdContext_64: "Impossible d'analyser le JSON envoyé.",
  arduinoOpErrorUnknown: "Erreur inattendue",
  /* Modals */
  noServerTitle: "L'appliation Kniwwelino-Blockly n'est pas en cours d'exécution",
  noServerTitleBody: "<p>Pour que toutes les caractéristiques de Kniwwelino-Blockly soient activées, l'application bureau Kniwwelino-Blockly doit être en cours d'exécution sur votre ordinateur.</p>" +
                     "<p>Si vous utilisez une version en ligne, vous ne pourrez pas configurer les paramètres, ni charger les blocs de code dans un Kniwwelino.</p>" +
                     "<p>Les instructions d'installation sont consultables sur la <a href=\"http://doku.kniwwelino.lu/en/installation\">Documentation Wiki Kniwwelino</a>.</p>" +
                     "<p>Si Kniwwelino-Blockly est déjà installé, assurez-vous que l'aplication est bien en cours d'exécution.</p>",
  noServerNoLangBody: "Si l'application Kniwwelino-Blockly n'est pas en cours d'exécution la langue ne pourra pas être correctement changée.",
  addBlocksTitle: "Blocs supplémentaires",
  /* Alerts */
  loadNewBlocksTitle: "Charger de nouveaux blocs ?",
  loadNewBlocksBody: "Charger un nouveau fichier XML va remplacer les blocs actuels de l'espace de travail.<br>"+
                     "Êtes-vous sûr de vouloir continuer ?",
  discardBlocksTitle: "Supprimer les blocs ?",
  discardBlocksBody: "Il y a %1 blocs dans l'espace de travail."+
                     "Êtes-vous sûr de vouloir les supprimer ?",
  invalidXmlTitle: "XML invalide",
  invalidXmlBody: "Le fichier XML n'a pas pu être correctement décrypté en blocs. Vérifiez le code XML et réessayez.",
  /* Tooltips */
  uploadingSketch: "Transfert du code sur le Kniwwelino...",
  uploadSketch: "Transférer le code sur le Kniwwelino",
	compiledSketch: "Sketch a été compilé. Téléchargement démarré sur Kniwwelino",
	compiledSketchFailed: "La compilation de Sketch a échoué. Vérifier ton code et la sortie de débogage.",
  verifyingSketch: "Vérififcation du Sketch...",
  verifySketch: "Vérifier le Sketch",
  openingSketch: "Ouverture du code dans Arduino IDE...",
  openSketch: "Ouvrir le code dans IDE",
  notImplemented: "La fonction n'est pas encore implémentée",
  /* Prompts */
  ok: "OK",
  okay: "Okay",
  close: "Fermer",
  cancel: "Annuler",
  return: "Retour",
  /* Cards */
  seeArduinoSourceCode: "Code Source",
  arduinoSourceCode: "Code Source Arduino",
  blocksXml: "Blocs XML",
  /* Toolbox Categories */
  catMatrix: "Matrice",
  catLogic: "Logique",
  catLoops: "Boucles",
  catMath: "Math",
  catText: "Texte",
  catVariables: "Variables",
  catFunctions: "Fonctions",
  catInputOutput: "Entrée/Sortie",
  catTime: "Temps",
  catAudio: "Audio",
  catMotors: "Moteurs",
  catComms: "Comms",
  catMQTT: "Messages",
  catButtons: "Boutons",
  catSensors: "Capteurs",
	/* Modal Dialog to manage Kniwwelino */
	manageKniwwelino: "Tes Kniwwelinos",
	manageKniwwelinoHeading: "Gérer vos cartes Kniwwelino",
	manageKniwwelinoAdd: "ajouter Kniwwelino en premier",
	manageKniwwelinoZero: "Tu gères: 0 Kniwwelinos",
	manageKniwwelinoManaging: "Tu gères:",
	manageKniwwelinoName: "Kniwwelino Nom",
	manageKniwwelinoPlaceholder: "Mon Kniwwelino (min. 3 caractères)",
	manageKniwwelinoHelp: "Démarrage avec le bouton A enfoncé et copier le motif que tu vois (LEDs d'éclairage) sur le Kniwwelino ci-dessous. Plus d'aide <a href='https://doku.kniwwelino.lu/en/preparation' target='_blank'>ici</a>.",
	manageKniwwelinoNoID: "Pas de Kniwwelino avec cette pièce d'ID trouvée. Vérifier que l'ID saisi est correct et que ton Kniwwelino est connecté à un Wifi.",
	manageKniwwelinoNoUniqueID: "Aucun ID unique n'a été trouvé pour ce Kniwwelino.",
	manageKniwwelinoNameRequired: "Nom requis",
	manageKniwwelinoNameRequired_message: "Donne-lui un nom.",
	manageKniwwelinoAlreadyManaging: "Tu gères déjà ce Kniwwelino!",
  manageKniwwelinoLoadLatest: "restaurer la dernière Sketch",
  restore: "Récupérer",
  backup: "Sauvegarder",
  invalidDeviceListTitle: "Liste d'appareils non valide",
  invalidDeviceListBody: "Le fichier que tu as téléchargé n'est pas valide. Choisir une autre option.",
	/* ALPHA VERSION */
	KNIWWELINO_ALPHA_TITLE: "Version Beta!",
	KNIWWELINO_ALPHA_MESSAGE: "Attention : Il s'agit d'une version beta et peut contenir des erreurs. Si tu trouves un problème, essaie de le reproduire avant de nous envoyer un rapport de bogue. Le service peut ne pas être disponible de temps à autre.",
	KNIWWELINO_WARNING_TITLE: "Attention",
	KNIWWELINO_ADDKNIWWELINO_TITLE: "Ajouter Kniwwelino en premier",
	KNIWWELINO_ADDKNIWWELINO_MESSAGE: "Pour utiliser cet outil de programmation, vous devez lier votre Kniwwelino à la plate-forme une seule fois. Veuillez appuyer sur l'icône d'équipement ci-dessous ou dans la barre de navigation pour ajouter votre Kniwwelino.",
};
