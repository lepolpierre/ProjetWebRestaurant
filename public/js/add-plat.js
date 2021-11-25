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


    },
    watch:{
        nom(newVal,oldVal){
            if(newVal.length >= 5){
                this.$refs.nomField.classList.remove("err");
                this.nomErr="";

            }
        },
        desc(newVal,oldVal){
            if(newVal.length >= 10){
                this.$refs.descField.classList.remove("err");
                this.descErr="";
            }
        },
        prix(newVal, oldVal){
            if(parseInt(newVal)> 0){
                this.$refs.prixField.classList.remove("err");
                this.prixErr = "";
            }
        }
    },
    methods: {
        verifNom(event){
            let msg = "Le nom du plat doit contenir 5 caractères au moins!";
            this.nomErr = this.nom.length < 5 ? msg : "";

            if(this.nom.length < 5 ) this.$refs.nomField.classList.add("err");
            // console.log(event.target.classList);
        },
        verifDesc(event){
            let msg = "La description du plat doit contenir 10 caractères au moins!";
            this.descErr = this.desc.length < 10 ? msg : "";

            if(this.desc.length < 10 )this.$refs.descField.classList.add("err");

        },
        verifPrix(event){
            let field = this.$refs.prixField;
            this.prix = parseInt(field.value);

            let msg = "Le prix du plat doit être supérieur à la valeur 0";
            this.prixErr = this.prix <= 0 ? msg : "";

            if(prix<=0)field.classList.add("err");

        },
        submitForm(){
            // Ajout de plat si champs valide.
            if(this.formValide()) this.appelApi();
            else console.error("Formulaire non valide!");
            
        },

        formValide(){
            this.verifNom();
            this.verifDesc();
            this.verifPrix();

            // return this.nom.length > 3 && this.desc.length > 10 & this.prix > 0 
            // && this.cats.includes(this.cat) && this.file != null;

            return true;
        },

        appelApi(){
            // [POST ajout de plat]

            const plat = {
                name : this.nom,
                desc : this.desc, 
                prix : this.prix, 
                vege : this.vege, 
                categorie: this.cat,
            };
            
            // Objet contenant l'image.
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('plat', JSON.stringify(plat));
            
            const options = {
                method: 'POST',
                body: formData,
        
            };

            // delete options.headers['Content-Type'];
            
            fetch("/menu/plat/add", options)
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
            console.log(this.file);
        }
    }


    
});