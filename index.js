let express=require('express')
let server=express()
let fs=require('fs')
let uploadFile=require('express-fileupload')

let mongoose=require('mongoose')

//import des données 
let models=require('./models')

//server.use(uploadFile) pour recevoir les fichiers
server.use(uploadFile())

// importer les fonctions 
let functions=require('./functions')

mongoose.connect(`mongodb+srv://hassounasalim:`+process.env.password+`@cluster0.mmwsg.mongodb.net/<dbname>?retryWrites=true&w=majority`,
{
    useMongoClient:true
}
)


server.get("/fichiersMots",(req,res)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    )
    
    res.send(models.similarite)
})
server.get("/fichiersTitresLiens",(req,res)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    )
    res.send(tabFichiersLiensTitres)
})
server.post("/EnvoieFichier",(req,res)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    )
    console.log(req)
    let file=req.files.file
    file.mv(`${__dirname}/files/${file.name}`)
    .then(d=>{
        fs.appendFileSync(`${__dirname}/files/${file.name}`,`<lien>${/*req.body.title*/"csv"}</lien>`,'utf8')
        res.send("fichier bien reçu")
    })
})
server.post("/post/:id",(req,res)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    )
    let miniscule= req.params.id.toLowerCase()
    let tab=miniscule.split(/\W+/)
    let tabNoSpace=functions.eliminationMotsTailleInfAUn(tab)
    let tousMosRequete=[]
    tabNoSpace.forEach(mot=>{
        mot=functions.eliminationSuffix(mot,models.tableauSuffixs)
        tousMosRequete.push([mot,'',''])
        tousMosRequete.push(["a","",""])
    })
    tousMosRequete=tousMosRequete.filter(mot=>mot[0].length>1)
    tousMosRequete=functions.supprimerElementsDuTableau(tousMosRequete,models.tableauMotsVides)
   let documentsTri=[]
    models.DictionnaireFichierMot.forEach(fichier=>{
        somme=0
        tabData=[]
        fichier['mot'].forEach(mot=>{
              tousMosRequete.forEach(motRequete=>{
                  //////////
                  let count=0
                  for (let i = 0; i < motRequete[0].length; i++) {
                    if(mot.includes(motRequete[0].charAt(i))){
                    count=count+1
                    }
                  }   
                  if(Math.abs(motRequete[0].length-count)<1){     
                      if(Math.abs(mot.length-motRequete[0].length)<3){
                                              //result.push({id:e.id,data:e.data()})
                    models.ObjetsFinaux.forEach(e=>{
                        console.log(mot)
                        if(e['mot']===mot && e['nomFichier']===fichier['nomFichier']){
                          somme=somme+e['PoidsMotTfIdf']
                          tabData.push(e)
                        }
                    })    
                      }    
                  }  

                  //////////
                  //if(mot===motRequete[0]){ 
                    /*  models.ObjetsFinaux.forEach(e=>{
                          if(e['mot']===mot && e['nomFichier']===fichier['nomFichier']){
                            somme=somme+e['PoidsMotTfIdf']
                            tabData.push(e)
                          }
                      }) */                       
                  //}
              })
        })
       documentsTri.push([somme,fichier['nomFichier'],tabData])
    })
    bool=false
    documentsTri.forEach(document=>{
        if(document[0]<0 || document[0]>0){
             bool=true
        }
    })
    let sorted=[]
    if(bool===true){
        const byValue = (b,a) => a[0] - b[0];
         sorted= [...documentsTri].sort(byValue);
         sorted=sorted.filter(e=>e[0]>0)
    }else{
         sorted= [0,"Aucun document correspond à votre recherche",[{}]]
        }
        res.send(sorted)

})
// lancer le serveur
server.listen(1234,function(){
    console.log("server en écoute au port 1234")
})
