let express=require('express')
let server=express()
let fs=require('fs')
let uploadFile=require('express-fileupload')

let DictionnaireMot=[]
let DictionnaireFichierMot=[]
let idfTab=[]
let ObjetsFinaux=[]

// importer les fonctions 
let functions=require('./functions')

// recupérer tous les fichiers
let fichiers=functions.getFilesList("./files")

// recupérer la liste des suffix dans un tableau
let tableauSuffixs= functions.readMotsVidesFiles("suffix.txt")

// recupérer la liste des mots vides
let tableauMotsVides= functions.readMotsVidesFiles("motsVides.txt")

/* le tableau dans lequel on recupère tous les tableaux qui contiennent chaque mot, son nombre d'occurence,
les tags dans lesquels il a apparu, somme des mots du fichier, poidTag, sommePoidsTags */

let OccurencesTousFichiers=[]

// tableau des fichiers et liens
tabFichiersLiensTitres=[]

// recuperer tous les mots de chaque fichier
tabFichierMots=[]

// pour chaque fichier -->
fichiers.forEach(fichier=>{   
    let tabs=[]
    // lire le fichier comme une chaine de charactère
    let stringMots= functions.readFiles("./files/"+fichier)
    // recupération des mots relatives à chaque tag
    let title=functions.recupererTitle(stringMots)    
    let h1=functions.recupererh1(stringMots)
    let h2=functions.recupererh2(stringMots)
    let h3=functions.recupererh3(stringMots)
    let h4=functions.recupererh4(stringMots)
    let h5=functions.recupererh5(stringMots)
    let h6=functions.recupererh6(stringMots)
    let meta=functions.recuperermeta(stringMots)
    let lien=functions.recupererlien(stringMots)
    let body=[stringMots.toString()]
    console.log(stringMots.toString())
// ajouter tous les fichiers avec leur lien sur internet et leur titre 
    tabFichiersLiensTitres.push({nomFichier:fichier,nomLien:lien,titre:title[0],description:meta})

// tableau contenant le nom de tag, les chaine de charactères de chaque tag, le poid du tag 
let TousTextTags=[
    ["meta",meta,6],
    ["title",title,5.5],
    ["h1",h1,5],
    ["h2",h2,4.5],
    ["h3",h3,4],
    ["h4",h4,3.5],
    ["h5",h5,3],
    ["h6",h6,2.5],
    ["p",body,1],

    /* */
]
let TousMots=[]

// pour chaque tableau de chaine de charactère de chaque tag
TousTextTags.forEach(tableau=>{
    // pour chaque chaine de charactère dans le tableau des chaines de charactère de chaque tag -->
    tableau[1].forEach(e=>{
        // rendre chaque chaine de charactère en miniscule
        let miniscule= e.toLowerCase()
        // pour chaque chaine de charactère recupérer que les mots et les nombres dans un tableau
        let tab=miniscule.split(/\W+/)
        // eliminer du tableau les mots de taille zéro
        let tabNoSpace=functions.eliminationMotsTailleInfAUn(tab)
        // pour chaque mot de chaque chaine de charactère de chaque tag --
        tabNoSpace.forEach(element=>{
            tabs.push(element)
            // enlever le suffix du mot
            element=functions.eliminationSuffix(element,tableauSuffixs)
            /*création tableau contenant des tableaux contenat chaqu'un chaque mot du corpus,
             le tag dans lequel il est apparu, le poids du tag */
            TousMots.push([element,tableau[0],tableau[2]])
        })       
    }) 
}) 
tabFichierMots.push({nomFichier:fichier,mot:tabs}) 

// supprimer tous les mots du fichier ayant une taille de un ou moins 
TousMots=TousMots.filter(e=>e[0].length>1)

// supprimer tous les mots vides du fichier
TousMots=functions.supprimerElementsDuTableau(TousMots,tableauMotsVides)

// calculer le nombre d'occurence de chaque mot de chaque fichier qui le contient 
let nombreOccurence=functions.calculerOccurenceDansLeTableau(TousMots)
// ajouter les nombres d'occurence de chaque fichier dans un tableau global
OccurencesTousFichiers.push({nomFichier:fichier,informations:nombreOccurence})

// ajouter la valeur tf pour chaque mot
OccurencesTousFichiers = functions.tf(OccurencesTousFichiers)

// construire un dictionnaire qui contient que les mots de tous les fichier (le corpus)
DictionnaireMot = functions.extraireToutMotsToutDocuments(OccurencesTousFichiers)[0]

// construire un tableau contenant des objets, chaque objet contient le nom du fichier et les mots associés
DictionnaireFichierMot = functions.extraireToutMotsToutDocuments(OccurencesTousFichiers)[1]

// calculer pour chaque mot le nombre de fichiers dans lequel il a apparu et les mettre dans des tableaux
idfTab=functions.calculIdf(DictionnaireMot,DictionnaireFichierMot) 

// ajouter les idf de chaque mot
OccurencesTousFichiers=functions.AjouterNOFPourOccurencesToutFichier(OccurencesTousFichiers,idfTab)

// calculer le poids de chaque mot
OccurencesTousFichiers=functions.calculerPoids(OccurencesTousFichiers)

// mise en forme de la donnée finale
ObjetsFinaux=functions.Nettoyage(OccurencesTousFichiers)
})
// recupérer les mots original après la fin des traitement en rajoutant les suffixs supprimés
/*DictionnaireFichierMot.forEach(object=>{
    tabFichierMots.forEach(object2=>{
        if(object.nomFichier==object2.nomFichier){
            for(let i=0;i<object.mot.length;i++){
                for(let j=0;j<object2.mot.length;j++){
                    if(object2.mot[j].startsWith(object.mot[i])){
                        object.mot[i]=object2.mot[j]
                    }                     
                }
            }
        }
    })
})*/

// constitution des mots avec leur poids pour chaque fichier
let similarite=[]
tabFichierMots.forEach(object=>{
    let tab=[]
    ObjetsFinaux.forEach(object2=>{
        if(object.nomFichier==object2.nomFichier){
              let a=object.mot.find(e=>e.startsWith(object2.mot))
              if(a !==undefined){
                  tab.push({text:a,value:object2.PoidsMotTfIdf*100})
              }
        }
    })
    similarite.push({nomFichier:object.nomFichier,mot:tab})
})


module.exports={DictionnaireMot,
                DictionnaireFichierMot,
                idfTab,ObjetsFinaux,
                similarite,
                tableauSuffixs,
                tableauMotsVides
            }