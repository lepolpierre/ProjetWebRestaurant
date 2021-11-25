"use strict";

var app = new Vue({
    el : '#app',
    data :{
        nom: "",
        nomErr: '',

        desc : "",
        descErr: '',

        prix : '',
        prixErr: '',

        vege : false,
        cat : "plat",
        cats : [ "dessert", "entree" , "plat"],

        file: null,
        fileErr: '',
        
        // Permet de déterminer s'il s'agit d'une première viste sur la page ou pas (Deja cliqué sur Submit).
        isFirstSubmit: true

    },
    watch:{
        nom(newVal,oldVal){
            if(newVal.length >= 5){
                this.$refs.nomField.classList.remove("err");
                console.log(this.$refs.nomField.classList);
                this.nomErr="";
            }
        }
    },
    methods: {
        verifNom(event){
            let msg = "Le nom du plat doit contenir 5 caractères au moins!";
            this.nomErr = this.nom.length < 5 ? msg : "";

            event.target.classList.add("err");
            // console.log(event.target.classList);
        },
        verifDesc(event){
            let msg = "La description du plat doit contenir 10 caractères au moins!";
            this.descErr = this.desc.length < 10 ? msg : "";

            event.target.classList.add("err");

        },
        verifPrix(event){
            this.prix = parseInt(event.target.value);

            let msg = "Le prix du plat doit être supérieur à la valeur 0";
            this.prixErr = this.prix <= 0 ? msg : "";

            event.target.classList.add("err");

        },
        submitForm(){
            // console.log(process.env.HOST);
            this.isFirstSubmit = false;

            // Ajout de plat si champs valide.
            if(this.formValide()) this.appelApi();
            else console.error("Formulaire non valide!");
            
        },

        formValide(){

            return this.nom.length > 3 && this.desc.length > 10 & this.prix > 0 
            && this.cats.includes(this.cat) && this.file != null;

            // return false;
        },

        appelApi(){
            // [POST ajout de plat]
            fetch("/menu/plat/add", {
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name : this.nom,
                    desc : this.desc, 
                    prix : this.prix, 
                    vege : this.vege, 
                    categorie: this.cat,
                    file: this.file
                })
            
            })
            .then(()=>{
                console.log("[ Form Submit ]");
                // Redirect vers la page affichant le menu.
                // window.location.href = '/menu';
            })
            .catch(err=>{
                console.error(err);
                throw err;
            });
        },


        onChangeFile(event){
            this.file= event.target.files[0];
        }
    }


    
});