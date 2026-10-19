const CATS=['Формалар','Доптар','Бутсылар','Қолғаптар','Гетрлер','Аксессуарлар'];
const STATUSES=['Жаңа','Өңделуде','Жолда','Жеткізілді','Бас тартылды'];
const SEED=[
{id:1,name:'Қазақстан құрамасы 2026 (үй)',cat:'Формалар',brand:'Adidas',price:24990,stock:25,color:'#facc15',desc:'Құрама командасының үйдегі формасы. Тыныс алатын жеңіл мата.'},
{id:2,name:'Real Madrid үйдегі форма',cat:'Формалар',brand:'Adidas',price:42990,stock:12,color:'#e5e7eb',desc:'Жаңа маусымдық форма, Aeroready технологиясы.'},
{id:3,name:'Barcelona қонақ формасы',cat:'Формалар',brand:'Nike',price:39990,stock:8,color:'#1d4ed8',desc:'Барселонаның қонақ формасы, Dri-FIT материалы.'},
{id:4,name:'Жаттығу формасы Kids',cat:'Формалар',brand:'Puma',price:12990,stock:30,color:'#ef4444',desc:'Балаларға арналған жаттығу жиынтығы.'},
{id:5,name:'Champions League добы',cat:'Доптар',brand:'Adidas',price:34990,stock:15,color:'#fff',desc:'Матчтық доп, FIFA Quality Pro сертификаты.'},
{id:6,name:'Жаттығу добы Pro №5',cat:'Доптар',brand:'Nike',price:11990,stock:40,color:'#fff',desc:'Күнделікті жаттығуға арналған берік доп.'},
{id:7,name:'Futsal мини-футбол добы',cat:'Доптар',brand:'Select',price:14990,stock:0,color:'#fff',desc:'Залға арналған доп. Қазір қоймада жоқ.'},
{id:8,name:'Phantom GX Elite',cat:'Бутсылар',brand:'Nike',price:89990,stock:10,color:'#111827',desc:'Шабуылшыларға арналған премиум бутсы.'},
{id:9,name:'Predator Accuracy',cat:'Бутсылар',brand:'Adidas',price:74990,stock:14,color:'#dc2626',desc:'Соққы дәлдігін арттыратын жоғарғы бөлік.'},
{id:10,name:'Future Ultimate',cat:'Бутсылар',brand:'Puma',price:68990,stock:9,color:'#16a34a',desc:'Жеңіл әрі икемді, жылдам ойыншыларға.'},
{id:11,name:'Copa сороконожки',cat:'Бутсылар',brand:'Adidas',price:29990,stock:22,color:'#0ea5e9',desc:'Жасанды шым мен залға арналған аяқ киім.'},
{id:12,name:'Қақпашы қолғабы Predator',cat:'Қолғаптар',brand:'Adidas',price:27990,stock:18,color:'#f97316',desc:'Латексті алақан, саусақ қорғанысымен.'},
{id:13,name:'Қақпашы қолғабы Vapor',cat:'Қолғаптар',brand:'Nike',price:22990,stock:11,color:'#8b5cf6',desc:'Нашар ауа райында да мықты ұстағыш.'},
{id:14,name:'Гетрлер Milano',cat:'Гетрлер',brand:'Adidas',price:4990,stock:60,color:'#1e3a8a',desc:'Терді тез кетіретін жұмсақ гетрлер.'},
{id:15,name:'Қорғаныс қалқандары',cat:'Аксессуарлар',brand:'Nike',price:7990,stock:35,color:'#9ca3af',desc:'Жеңіл қалқандар, жұмсақ беті бар.'},
{id:16,name:'Team спорт сөмкесі',cat:'Аксессуарлар',brand:'Puma',price:15990,stock:20,color:'#0f172a',desc:'Бутсыға бөлек бөлімі бар сыйымды сөмке.'}
];
