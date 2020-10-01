<template>
 <div class="modal-backdrop" id="register">
    <div class="c-modal custom-margin">
      <div class="c-modal-body">
        <div class="home-banner-register">
            <div class="form-register-container">
                <div class="form-logo">
                    <img src="img/logo_gtt_color.svg" alt="go travel and tours">
                    <hr>
                    <div class="form-inicio-sesion-text antonio-bold">Registro</div>
                </div>
                <form action="/Register" method="POST">
                    <div class="form-group inputs-container hn-roman">
                        <div class="test-error" v-if="testErrorVisible">{{testError}}</div>
                        <ValidationObserver ref="observer"
                                             tag="form" @submit.prevent="submit()">
                            <ValidationProvider rules="required" v-slot="{errors}">
                                <input v-model="username" type="text" class="form-control" name="username" id="username-input" placeholder="Usuario">
                                <span>{{errors[0]}}</span>
                            </ValidationProvider>
                                <input v-model="phone" type="text" class="form-control" name="phone" id="phone-input" placeholder="Teléfono">
                                <input v-model="email" type="email" class="form-control" name="email" id="email-input" placeholder="Correo electrónico">
                                <input v-model="password" type="password" class="form-control" name="password" id="password-input" placeholder="Contraseña">
                                <input v-model="confirm_password" type="password" class="form-control" name="confirm_password" id="confirm-password-input" placeholder="Confirme la contraseña">
                        </ValidationObserver>
                    </div>
                    <div class="form-password-forgotten hn-roman">¿Ya tienes una cuenta? <a href="#">Inicia Sesión</a></div>
                    <div class="home-actions antonio-regular">
                        <button class="btn home-sign-up" type="button" @click="submit()">registrarse</button>
                        <button class="btn home-sign-up" type="button" @click="close">cerrar</button>
                    </div>
                </form>
                <div class="terms-of-use hn-roman">
                    Al iniciar sesión o al crear una cuenta, acepta nuestros Términos de uso y la Declaración de privacidad
                </div>
            </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
import {authRegister} from '../../utils/auth'

export default {
    data(){
        return {
            username: '',
            phone: '',
            email: '',
            password: '',
            confirm_password: '',
            testErrorVisible: false,
            testError: ''
        }
    },
    methods: {
        close(){
            this.$emit('closeModal')
        },
        async submit(){
            const valid = await this.$refs.observer.validate()
            if(valid){
                let user = {
                    username: this.username,
                    password: this.password,
                    phone: this.phone,
                    email: this.email
                }
                authRegister(user).then(({data}) => {
                    console.log(data)
                }).catch(resp => {
                    this.testError = `Ocurrió un problema con la conexión (Código de Error: ${resp.response.status})`
                    this.testErrorVisible = true
                    setTimeout(()=>this.testErrorVisible = false,3000)
                })
                console.log('lo mío primero')
            }
        }
    }

}
</script>

<style>
    .terms-of-use{
        font-weight: bold;
        line-height: 1.2;
        font-size: 12px;
        text-align: center;
    }

    #register.modal-backdrop{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 1 !important;
        background-color: rgba(0, 0, 0, 0.7);
    }

    #register .c-modal{
        position: absolute;
        border-radius: 10px;
        left: 50%;
        -webkit-transform: translate(-100%, 0);
        top: 20%;
        background-color: white;
        width: 25%;
        height: auto;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 30px;
        padding-right: 30px;
    }

    #register input{
        margin-top: 15px;
        height: 50px;
    }
    #register .home-actions{
        float: none;
        padding-top: 15px;
        padding-bottom: 15px;
        text-align: right;
    }
    @media(max-width: 1440px)
    {
        .c-modal{
            top: 29%;
            width: 49.06vw;
            height: 300px;
        }
        .searching-text{
            font-size: 36px;
        }
        .c-modal-bottom .second-column{
            font-size: 10px;
        }
    }
</style>