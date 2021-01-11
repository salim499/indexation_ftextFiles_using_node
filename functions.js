const fs=require('fs')

//Agnes.NAVETAT@cdc-habitat.fr
exports.eliminationMotsTailleInfAUn=(tableau)=>{
    let tabNoSpace=[]
    tableau.forEach(el=>{
        if(el.length>1){
            tabNoSpace.push(el)           
        }
    })
    return tabNoSpace
}
exports.supprimerElementsDuTableau=(tableaus, tableau2s)=>{
       tableau2s.forEach((e)=>{  
        tableaus=tableaus.filter(el=>e.startsWith(el[0])===false)
       })
       return tableaus
}
exports.calculerOccurenceDansLeTableau=(tableau)=>{
     let bool=false
     let tab=[]
       tableau.forEach(e=>{
          tab.forEach(el=>{
              if(el[0]==e[0]){
                  el[1]=el[1]+1
                  el[2]=el[2]+"+"+e[1]
                  el[3]=el[3]+e[2]
                  bool=true
              }
          })
          if(bool==false){
              tab.push([e[0],1,e[1],e[2]])
          }
          bool=false
       })
       let sommeOccurence=0
       let sommePoids=0
      tab.forEach(e=>{
          sommeOccurence=sommeOccurence+e[1]
          sommePoids=sommePoids+e[3]
      })
      tab.forEach(e=>{
       e[4]=sommeOccurence
        e[5]=sommePoids
    })
       return tab
}

exports.TableauVideBool=(tab)=>{
       if(tab.length==0){
        return true
       }else{
           return false
       }
}
exports.tf=(tableau)=>{
    tableau.forEach(e=>{
        e["informations"].forEach(el=>{
            el[6]=el[1]/el[4]
            el[7]=el[3]/el[5]
            el[8]=el[1]/el[4]+el[3]/el[5]
        })
    })
    return tableau
}
exports.extraireToutMotsToutDocuments=(OccurencesTousFichiers)=>{
    let DictionnaireFichierMot=[]
    let DictionnaireMot=[]
    OccurencesTousFichiers.forEach(e=>{
        let tab=[]
        e["informations"].forEach(el=>{ 
            if(DictionnaireMot.includes(el[0])==false){
                DictionnaireMot.push([el[0],0])
            }
        tab.push(el[0])
        })
        DictionnaireFichierMot.push({nomFichier:e["nomFichier"],mot:tab})
    })
    return([DictionnaireMot,DictionnaireFichierMot])
}
exports.calculIdf=(DictionnaireMot,DictionnaireFichierMot)=>{
        DictionnaireMot.forEach(mot=>{
            DictionnaireFichierMot.forEach(e=>{
                 if(e["mot"].includes(mot[0])){
                     mot[1]=mot[1]+1
                 }
            })
        })
        return DictionnaireMot
}
exports.AjouterNOFPourOccurencesToutFichier=(OccurencesTousFichiers,idfTab)=>{
    OccurencesTousFichiers.forEach(e=>{
        e["informations"].forEach(e=>{
            idfTab.forEach(el=>{
                if(el[0]===e[0]){
                    e[9]=el[1]
                }
            })
        })
    })

    return OccurencesTousFichiers
}
exports.calculerPoids=(OccurencesTousFichiers)=>{
    OccurencesTousFichiers.forEach((fichier)=>{
           fichier["informations"].forEach((e)=>{
               e[10]=e[8]*1/e[9]
               e[11]=fichier["nomFichier"]
           })
    })
    return OccurencesTousFichiers
}
exports.Nettoyage=(OccurencesTousFichiers)=>{
    let tab=[]
    OccurencesTousFichiers.forEach((fichier)=>{
        fichier["informations"].forEach((e)=>{
            tab.push({
                mot:e[0],
                nomFichier:e[11],
                tagsApparition:e[2],
                nombreOccurencesDansFichier:e[1],
                poidsTags:e[3],
                nombreMotsDansLefichier:e[4],
                sommePoidsTags:e[5],
                nombreFichiersAillentLeMot:e[9],
                frequenceMotDansFichier:e[6],
                frequencePoidTagDansFichier:e[7],
                SommeFrequencesMotTag:e[8],
                PoidsMotTfIdf:e[10]
            })
        })
 })
 return tab
}
exports.readMotsVidesFiles=(fichier)=>{
    let a= fs.readFileSync(fichier,"utf-8")
    let b=a.split(/\W+/)
    return  b  
}

exports.readFiles=(fichier)=>{
   let a= fs.readFileSync(fichier,"utf-8")
    return  a  
}
exports.eliminationSuffix=(element,tableauSuffixs)=>{
    let plusGrandSuffix=""
    tableauSuffixs.forEach(suffix=>{
        if(element.endsWith(suffix)){
            if(plusGrandSuffix.length<suffix.length){
                plusGrandSuffix=suffix
            }
        }
    })
    element=element.replace(plusGrandSuffix,"")
    return element
}
exports.getFilesList=(dossier)=>{
let files=fs.readdirSync(dossier)
return files
}
exports.recupererParagraphes=(str)=>{
        let result=[]
        let result1=str.match(/<p>(.*?)<\/p>/g)
        if(result1!==null){
            result = result1.map(function(val){
                return val.replace(/<\/?p>/g,'');
             });
        }
    return result   
}
exports.recupererTitle=(str)=>{
    let result=[]
    let result1=str.match(/<title>(.*?)<\/title>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?title>/g,'');
         });
    }
return result   
}
exports.recupererh1=(str)=>{
    let result=[]
    let result1=str.match(/<h1>(.*?)<\/h1>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?h1>/g,'');
         });
    }
return result 
}
exports.recupererh2=(str)=>{
    let result=[]
    let result1=str.match(/<h2>(.*?)<\/h2>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?h2>/g,'');
         });
    }
return result    
}
exports.recupererh3=(str)=>{
    let result=[]
    let result1=str.match(/<h3>(.*?)<\/h3>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?h3>/g,'');
         });
    }
return result 
}
exports.recupererh4=(str)=>{
    let result=[]
    let result1=str.match(/<h4>(.*?)<\/h4>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?h4>/g,'');
         });
    }
return result   
}
exports.recupererh5=(str)=>{
    let result=[]
    let result1=str.match(/<h5>(.*?)<\/h5>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?h5>/g,'');
         });
    }
return result  
}
exports.recupererh6=(str)=>{
    let result=[]
    let result1=str.match(/<h6>(.*?)<\/h6>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?h6>/g,'');
         });
    }
return result 
}
exports.recupererlien=(str)=>{
    let result=[]
    let result1=str.match(/<lien>(.*?)<\/lien>/g)
    if(result1!==null){
        result = result1[0].replace(/<\/?lien>/g,'');
    }
return result 
}
exports.recuperermeta=(str)=>{
    let result=[]
    let result1=str.match(/<meta>(.*?)<\/meta>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?meta>/g,'');
         });
    }
return result 
}
exports.recupererscript=(str)=>{
    let result=[]
    let result1=str.match(/<script>(.*?)<\/script>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?script>/g,'');
         });
    }
return result 
}

/*exports.recupererhead=(str)=>{
    let result=[]
    let result1=str.match(/<head(.*?)>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<head/g,'');
         });
    }
return result 
}*/
exports.recupererbody=(str)=>{
    let result=[]
    let result1=str.match(/<body>(.*?)<\/body>/g)
    if(result1!==null){
        result = result1.map(function(val){
            return val.replace(/<\/?body>/g,'');
         });
    }
return result 
}