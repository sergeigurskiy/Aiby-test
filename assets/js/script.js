import { ApiService } from "./service/apiService";

window.addEventListener('DOMContentLoaded', function () {
    let bodySel = document.body;
    class TranslateLangs {
        constructor(apiBaseUrl) {
            this.apiBaseUrl = apiBaseUrl;
            this.availLangs = ['de', 'en', 'es', 'fr', 'ja', 'pt', 'zh'];
            this.sysLang = this.getSystemLanguage();
            this.currentLang = this.getCurrentValidLang();
            this.currentUrlLang = this.getValidUrl();
            this.translations = {};


        }

        getCurrentValidLang() {
            let sysLang = this.getSystemLanguage();
            if (!(this.availLangs.includes(sysLang))) {
                return 'en';
            } else {
                return sysLang;
            }
        }
        // валидация системного языка с нужными


        getSystemLanguage() {
            const lang = navigator.language || 'en';
            return lang.split('-')[0].toLowerCase();

        }
        // получил системный язык


        getUrl() {
            const searchLang = new URLSearchParams(window.location.search);
            let langParam = searchLang.get('lang');
            if (langParam) {
                return langParam.toLocaleLowerCase();
            }
            return null;
        }
        // watch урлов, ловлю какой ввели параметр 

        getValidUrl() {
            let urlLang = this.getUrl();
            if (urlLang && this.availLangs.includes(urlLang)) {
                bodySel.classList.add(urlLang)
                return urlLang
            } else {
                return this.currentLang;
            }
        }

        async getLangs(lang) {
            let encodeUrl = encodeURIComponent(`${this.apiBaseUrl}${lang}.json`);
            let apiUrl = `https://corsproxy.io/?${encodeUrl}`;
            const data = await new ApiService(apiUrl).changeLang();
            this.translations[lang] = data;
            return data
        }
        // запрос исходя из урлов

        async updateUi() {
            await this.getLangs(this.currentUrlLang);
            this.updateAllElements();
        }
        // функция отрисовки контента от параметра в url

        updateAllElements() {
            const elems = document.querySelectorAll('[data-lan]');
            elems.forEach(element => {
                this.updateElement(element);
            });
        }
        // селекторы с data-атрибутов для переводов

        updateElement(element) {
            let name = element.getAttribute('data-lan');
            if (!name) return;
            let translation = this.translations[this.currentUrlLang][name]
            if (!translation) return;
            let text = translation;

            let attrData = [...element.attributes];
            attrData.forEach(attr => {
                const attrName = attr.name;
                const attrValue = attr.value;

                if (attrName.startsWith('data-lan-') && attrName !== 'data-lan' && attrName !== 'data-lan-type') {
                    let nameVariable = attrName.replace('data-lan-', '');
                    text = text.replace(`{{${nameVariable}}}`, attrValue)
                }
            })
            const type = element.getAttribute('data-lan-type');

            if (type === 'html') {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
        // функция получения данных data-атрибутов + отрисовка контента входными данными, подставление price
        //  

    }

    const aibyTranslate = new TranslateLangs('https://site.target-group.by/jsons/');

    const urlParams = new URLSearchParams(window.location.search);
    const hasLangParam = urlParams.has('lang');
    
    if(hasLangParam){
        aibyTranslate.updateUi().then(() => {
            console.log('init', aibyTranslate.currentUrlLang);
        }).catch (err => {
            console.error('error: ', err );
        });
    }

    // запуск класса + чтение данных в url
    

});