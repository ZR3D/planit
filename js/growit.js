(function () {
  'use strict';
  
  // --- Global Declarations ---
  let growData = [];
  let filterList = {month:null, type:'all'};
  
  const dom = {};  
  const plantList = [
  {"title":"Aloe Vera Plants","type":"herb","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"","germinate":"","lifeCycle":"perennial","mature":"","id":"wju3ewwr7" },
  {"title":"Anise Hyssop Seeds","type":"herb","month":[ 8, 9, 10, 11],"raise":"raise seedlings, depth 2mm","germinate":"10-20 days @ 20-22°c","lifeCycle":"perennial ↔40cm","mature":"80","id":"zh4k4wzyg" },
  {"title":"Basil Seeds","type":"herb","month":[ 1, 2, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 3mm","germinate":"5-10 days @ 18-35°c","lifeCycle":"annual ↔25-40cm","mature":"60-80","id":"aykef0lpf" },
  {"title":"Bergamot Seeds","type":"herb","month":[ 1, 2, 3, 10, 11, 12],"raise":"raise seedlings, depth 1mm","germinate":"7-14 days @ 16-21°c","lifeCycle":"perennial ↔30-45cm","mature":"365","id":"djod0j9ev" },
  {"title":"Borage Seeds","type":"herb","month":[ 1, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 10mm","germinate":"5-10 days @ 20-22°c","lifeCycle":"annual ↔30cm","mature":"80-90","id":"7vi7fb62r" },
  {"title":"Calendula Seeds","type":"herb","month":[ 2, 3, 4, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 15mm","germinate":"7-14 days @ 20-22°c","lifeCycle":"annual ≡60cm ↔50-60cm","mature":"70-80","id":"8hc0e5b5j" },
  {"title":"Caper Bush Seeds","type":"herb","month":[ 9, 10, 11],"raise":"raise seedlings, depth 2mm","germinate":"14-28 days @ 20-25°c","lifeCycle":"perennial ↔150cm","mature":"3-4 years","id":"vkavjk4fm" },
  {"title":"Catmint Seeds","type":"herb","month":[ 1, 2, 3, 10, 11, 12],"raise":"raise seedlings, depth 10mm","germinate":"10-20 days @ 21-27°c","lifeCycle":"perennial ↔60cm","mature":"90","id":"o36kofosl" },
  {"title":"Catnip Seeds","type":"herb","month":[ 1, 2, 3, 10, 11, 12],"raise":"raise seedlings, depth 5mm","germinate":"10-20 days @ 21-27°c","lifeCycle":"perennial ↔60cm","mature":"90","id":"qnf1eflnb" },
  {"title":"Chervil Seeds","type":"herb","month":[ 1, 2, 3, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"10-14 days @ 13-20°c","lifeCycle":"biennial ↔30cm","mature":"60-70","id":"o42nmwnkv" },
  {"title":"Chives Seeds","type":"herb","month":[ 1, 2, 3, 10, 11, 12],"raise":"sow direct, depth 5mm","germinate":"7-14 days @ 18-21°c","lifeCycle":"perennial ≡15cm ↔15cm","mature":"60-90","id":"b19irfg23" },
  {"title":"Collards Seeds","type":"herb","month":[ 1, 2, 3, 4],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"3-7 days @ 8-30°c","lifeCycle":"biennial ≡100cm ↔80cm","mature":"60-80","id":"41vh827ar" },
  {"title":"Comfrey Seeds","type":"herb","month":[ 2, 3, 4, 9, 10, 11],"raise":"raise seedlings, depth 5mm","germinate":"25-30 days @ 20-22°c","lifeCycle":"perennial ↔60cm","mature":"365","id":"hlxrvrul2" },
  {"title":"Coriander Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"sow direct, depth 6mm","germinate":"7-14 days @ 18-21°c","lifeCycle":"annual ≡20cm ↔20cm","mature":"30-45","id":"jbx5mnho5" },
  {"title":"Corn Salad Seeds","type":"herb","month":[ 3, 4, 5, 8, 9],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"7-12 days @ 10-20°c","lifeCycle":"annual ≡30-45cm ↔20cm","mature":"45-60","id":"31hk7uhmr" },
  {"title":"Cress Seeds","type":"herb","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"sow direct, depth 4mm","germinate":"6-14 days @ 7-15°c","lifeCycle":"biennial ≡15cm ↔5-15cm","mature":"15-50","id":"ck02233mr" },
  {"title":"Dill Seeds","type":"herb","month":[ 1, 9, 10, 11, 12],"raise":"sow direct, depth 2mm","germinate":"7-21 days @ 18-22°c","lifeCycle":"annual ↔20cm","mature":"60-100","id":"k8w977o66" },
  {"title":"Echinacea Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"10-15 days @ 18-21°c","lifeCycle":"perennial ↔30-50cm","mature":"90-140","id":"e8rz2xhxr" },
  {"title":"Fennel Seeds","type":"herb","month":[ 1, 2, 3, 9, 10, 11, 12],"raise":"sow direct, depth 8mm","germinate":"7-14 days @ 10-30°c","lifeCycle":"biennial ≡60cm ↔40cm","mature":"80-100","id":"21apbi317" },
  {"title":"Feverfew Seeds","type":"herb","month":[ 1, 2, 9, 10, 11, 12],"raise":"raise seedlings, depth 1mm","germinate":"10-14 days @ 20-22°c","lifeCycle":"perennial ↔20-40cm","mature":"100-110","id":"o1l404qdt" },
  {"title":"Galangal Rhizomes","type":"herb","month":[ 11, 12],"raise":"","germinate":"","lifeCycle":"","mature":"","id":"qsuj4ozps" },
  {"title":"German Chamomile Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 1mm","germinate":"7-14 days @ 20-30°c","lifeCycle":"annual ↔20-30cm","mature":"65","id":"m46ak9gnv" },
  {"title":"Ginger Rhizomes","type":"herb","month":[ 11, 12],"raise":"","germinate":"","lifeCycle":"","mature":"","id":"xijwtaa49" },
  {"title":"Hyssop Seeds","type":"herb","month":[ 1, 2, 9, 10, 11, 12],"raise":"raise seedlings, depth 6mm","germinate":"3-10 days @ 20-22°c","lifeCycle":"perennial ↔40-60cm","mature":"90-95","id":"5h6joyohr" },
  {"title":"Lavender Seeds","type":"herb","month":[ 9, 10, 11],"raise":"raise seedlings, depth 0mm","germinate":"14-21 days @ 18-21°c","lifeCycle":"perennial ↔40-80cm","mature":"356","id":"ill17kovk" },
  {"title":"Lemon Balm Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"raise seedlings, depth 3mm","germinate":"7-14 days @ 19-21°c","lifeCycle":"perennial ↔50cm","mature":"60-70","id":"jvs343751" },
  {"title":"Lovage Seeds","type":"herb","month":[ 1, 2, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"7-21 days @ 20-25°c","lifeCycle":"perennial ↔100cm","mature":"90","id":"x9rdzammz" },
  {"title":"Meadowsweet Seeds","type":"herb","month":[ 3, 4, 5, 9, 10, 11],"raise":"","germinate":"10-30 days @ 20-22°c","lifeCycle":"perennial ↔60cm","mature":"195","id":"5m9dpdc9t" },
  {"title":"Mint Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"raise seedlings, depth 1mm","germinate":"10-14 days @ 13-18°c","lifeCycle":"perennial ↔30cm","mature":"80-100","id":"ne8nm19na" },
  {"title":"Mustard Seeds","type":"herb","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"sow direct, depth 5mm","germinate":"7-14 days @ 18-20°c","lifeCycle":"annual ≡40-60cm ↔30-40cm","mature":"30 to 60","id":"9sfs4ep1w" },
  {"title":"Nasturtium Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 15mm","germinate":"7-14 days @ 16-20°c","lifeCycle":"annual ↔30-45cm","mature":"70-80","id":"9oww5bd2u" },
  {"title":"Oregano Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-14 days @ 18-21°c","lifeCycle":"perennial ↔50cm","mature":"85-100","id":"px7bu1wqd" },
  {"title":"Parsley Seeds","type":"herb","month":[ 1, 2, 3, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"14-28 days @ 10-30°c","lifeCycle":"biennial ≡30cm ↔30-40cm","mature":"100-130","id":"fbdh9t2it" },
  {"title":"Shiso Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"raise seedlings, depth 1mm","germinate":"7-21 days @ 19-21°c","lifeCycle":"annual ↔30cm","mature":"80-95","id":"pthtqw1kn" },
  {"title":"Purslane Seeds","type":"herb","month":[ 1, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 3mm","germinate":"7-10 days @ 15-35°c","lifeCycle":"annual ↔30cm","mature":"50-60","id":"ic3urlucr" },
  {"title":"Roman Lawn Chamomile Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"sow direct, depth 1mm","germinate":"7-14 days @ 12-25°c","lifeCycle":"perennial ↔20cm","mature":"230","id":"prhv8zvvf" },
  {"title":"Root Parsley Seeds","type":"herb","month":[ 1, 2, 3, 9, 10, 11, 12],"raise":"sow direct, depth 5mm","germinate":"14-28 days @ 10-30°c","lifeCycle":"biennial ≡30cm ↔30-40cm","mature":"100-130","id":"zv5q2y4aa" },
  {"title":"Rosemary Seeds","type":"herb","month":[ 3, 4, 5, 9, 10, 11],"raise":"raise seedlings, depth 3mm","germinate":"15-25 days @ 21-17°c","lifeCycle":"perennial ↔150cm","mature":"100-150","id":"lezk4ya19" },
  {"title":"Russian Tarragon Seeds","type":"herb","month":[ 9, 10, 11],"raise":"raise seedlings, depth 1mm","germinate":"10-14 days @ 15-20°c","lifeCycle":"perennial ↔50cm","mature":"90-100","id":"l2t961482" },
  {"title":"Saffron Crocus Corms","type":"herb","month":[ 1, 2, 3, 4, 12],"raise":"","germinate":"","lifeCycle":"perennial ↔10-15cm","mature":"60-90","id":"ltc22awa6" },
  {"title":"Sage Seeds","type":"herb","month":[ 9, 10, 11],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-21 days @ 18-21°c","lifeCycle":"perennial ↔50cm","mature":"60-90","id":"3zsb6vv0m" },
  {"title":"Savory Seeds","type":"herb","month":[ 9, 10, 11],"raise":"sow direct or raise seedlings, depth 3mm","germinate":"7-14 days @ 20-22°c","lifeCycle":"perennial ↔30-40cm","mature":"60-70","id":"vwd5vlwxk" },
  {"title":"Sorrel Seeds","type":"herb","month":[ 3, 4, 5, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-14 days @ 22-22°c","lifeCycle":"perennial ↔30cm","mature":"60","id":"10qu3uuxi" },
  {"title":"Thyme Seeds","type":"herb","month":[ 9, 10, 11, 12],"raise":"raise seedlings, depth 3mm","germinate":"14-21 days @ 18-21°c","lifeCycle":"perennial ↔25cm","mature":"70-90","id":"b20oj1u2q" },
  {"title":"Turmeric Rhizomes","type":"herb","month":[ 11, 12],"raise":"","germinate":"","lifeCycle":"","mature":"","id":"q422ao11x" },
  {"title":"Water Cress Seeds","type":"herb","month":[ 1, 2, 3, 4, 9, 10, 11, 12],"raise":"raise seedlings, depth 3mm","germinate":"12-15 days @ 8-15°c","lifeCycle":"perennial ↔100cm","mature":"50-60","id":"lc81lxwkz" },
  {"title":"Yarrow Seeds","type":"herb","month":[ 9, 10, 11],"raise":"raise seedlings, depth 2mm","germinate":"10-14 days @ 18-22°c","lifeCycle":"perennial ↔60cm","mature":"130-150","id":"a2wi5bscd" },
  {"title":"Amaranth Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"sow direct, depth 3mm","germinate":"7-10 days @ 20-25°c","lifeCycle":"annual ↔60cm","mature":"100","id":"w4ygsqyqh" },
  {"title":"Artichoke Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"sow direct or raise seedlings, depth 10mm","germinate":"5-20 days @ 21-26°c","lifeCycle":"perennial ≡50-80cm ↔50cm","mature":"290-400","id":"wgzilfn0i" },
  {"title":"Asparagus Crowns","type":"vegetable","month":[ 6, 7, 8, 9, 10],"raise":"","germinate":"","lifeCycle":"perennial ≡70-100cm ↔50-70cm","mature":"390-420","id":"d0wd9zi2u" },
  {"title":"Asparagus Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"sow direct or raise seedlings, depth 10mm","germinate":"14-21 days @ 23-27°c","lifeCycle":"perennial ≡100cm ↔20-40cm","mature":"2-3 years","id":"yv0aqpfti" },
  {"title":"Bean Seeds","type":"vegetable","month":[ 1, 10, 11, 12],"raise":"sow direct, depth 20mm","germinate":"6-10 days @ 16-30°c","lifeCycle":"annual ≡40-100cm ↔10-20cm","mature":"50-85","id":"uqybyd2cr" },
  {"title":"Beetroot Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 9, 10, 11, 12],"raise":"sow direct, depth 15mm","germinate":"5-10 days @ 10-30°c","lifeCycle":"biennial ≡30-40cm ↔5-10cm","mature":"55-85","id":"5di92agcj" },
  {"title":"Bitter Melon Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct, depth 15mm","germinate":"10-15 days @ 25-32°c","lifeCycle":"annual ≡130-160cm ↔60cm","mature":"75","id":"2picipxc2" },
  {"title":"Blackberry Canes","type":"vegetable","month":[ 6, 7, 8],"raise":"","germinate":"","lifeCycle":"perennial ≡200-250cm ↔150-180cm","mature":"420","id":"yntjbrqfb" },
  {"title":"Boysenberry Canes","type":"vegetable","month":[ 6, 7, 8],"raise":"","germinate":"","lifeCycle":"perennial ≡200-250cm ↔150-180cm","mature":"420","id":"uic4bgcr3" },
  {"title":"Broad Bean Seeds","type":"vegetable","month":[ 3, 4, 5, 8, 9],"raise":"sow direct, depth 50mm","germinate":"7-14 days @ 6-24°c","lifeCycle":"annual ≡100cm ↔30cm","mature":"90","id":"ksy1awizq" },
  {"title":"Broccoli Seeds","type":"vegetable","month":[ 1, 2, 3, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"3-7 days @ 8-30°c","lifeCycle":"biennial ≡40-60cm ↔35-45cm","mature":"60-120","id":"rku5dc7em" },
  {"title":"Brussels Sprouts Seeds","type":"vegetable","month":[ 1, 2, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"7-14 days @ 7-25°c","lifeCycle":"biennial ≡90-100cm ↔50-75cm","mature":"80-140","id":"livftdh8w" },
  {"title":"Bulb Onion Seeds","type":"vegetable","month":[ 2, 3, 4, 5, 6, 7, 8, 9],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-14 days @ 20-25°c","lifeCycle":"biennial ≡25-40cm ↔5-10cm","mature":"60-230","id":"e9l3yucky" },
  {"title":"Bunching Onion Seeds","type":"vegetable","month":[ 3, 4, 5, 6, 7, 8, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-10 days @ 15-25°c","lifeCycle":"perennial ≡30cm ↔3cm","mature":"60-90","id":"prhgl8nnt" },
  {"title":"Burdock Seeds","type":"vegetable","month":[ 1, 2, 9, 10, 11, 12],"raise":"sow direct, depth 15mm","germinate":"7-14 days @ 20-25°c","lifeCycle":"biennial ≡60cm ↔15cm","mature":"120","id":"87g21jy32" },
  {"title":"Cabbage Seeds","type":"vegetable","month":[ 2, 3, 4, 8, 9],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"3-7 days @ 8-30°c","lifeCycle":"annual ≡40-60cm ↔25-60cm","mature":"50-140","id":"2bsh7b8li" },
  {"title":"Cape Gooseberry Seeds","type":"vegetable","month":[ 10, 11],"raise":"raise seedlings, depth 4mm","germinate":"14-42 days @ 21-29°c","lifeCycle":"perennial ↔30-100cm","mature":"140","id":"ggguldu23" },
  {"title":"Capsicum Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-21 days @ 22-35°c","lifeCycle":"perennial ≡60-100cm ↔40-60cm","mature":"60 to 100","id":"cnh7ae06s" },
  {"title":"Carob Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"","germinate":"12-38 days @ 22-26°c","lifeCycle":"perennial ↔10m","mature":"5-8 years","id":"4joc25e13" },
  {"title":"Carrot Seeds","type":"vegetable","month":[ 1, 2, 3, 8, 9, 10, 11, 12],"raise":"sow direct, depth 5mm","germinate":"14-21 days @ 10-30°c","lifeCycle":"biennial ≡25-30cm ↔3-8cm","mature":"70-140","id":"u7nle6fgi" },
  {"title":"Cauliflower Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-14 days @ 10-30°c","lifeCycle":"biennial ≡75-90cm ↔45-70cm","mature":"100-160","id":"ghb2cuvpt" },
  {"title":"Celeriac Seeds","type":"vegetable","month":[ 1, 10, 11, 12],"raise":"raise seedlings, depth 5mm","germinate":"14-21 days @ 20-24°c","lifeCycle":"biennial ≡80cm ↔30cm","mature":"120","id":"ejrfy9ll4" },
  {"title":"Celery Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"raise seedlings, depth 3mm","germinate":"14-21 days @ 21-25°c","lifeCycle":"biennial ≡30-55cm ↔20-30cm","mature":"120-140","id":"87obffgtl" },
  {"title":"Chia Seeds","type":"vegetable","month":[ 3, 4, 5, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 3mm","germinate":"1-4 days @ 20-22°c","lifeCycle":"annual ≡150cm ↔30cm","mature":"120","id":"rokbfcung" },
  {"title":"Chickpea Seeds","type":"vegetable","month":[ 5, 6, 7, 8],"raise":"sow direct or raise seedlings, depth 20mm","germinate":"7-30 days @ 10-15°c","lifeCycle":"annual ≡60cm ↔20cm","mature":"100","id":"1x8olnuat" },
  {"title":"Chicory Seeds","type":"vegetable","month":[ 10, 11],"raise":"sow direct, depth 5mm","germinate":"4-10 days @ 15-18°c","lifeCycle":"perennial ≡30cm ↔20cm","mature":"50-65","id":"jn9025a7h" },
  {"title":"Chilli Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-21 days @ 22-35°c","lifeCycle":"perennial ≡60-100cm ↔40-60cm","mature":"60 to 100","id":"xvd8odtw3" },
  {"title":"Chinese Cabbage Seeds","type":"vegetable","month":[ 1, 2, 3, 8, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"7-14 days @ 7-23°c","lifeCycle":"annual ≡40cm ↔25-40cm","mature":"40-100","id":"aitqza8o5" },
  {"title":"Corn Salad Seeds","type":"vegetable","month":[ 3, 4, 5, 8, 9],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"7-12 days @ 10-20°c","lifeCycle":"annual ≡30-45cm ↔20cm","mature":"45-60","id":"ncpkifl09" },
  {"title":"Corn Seeds","type":"vegetable","month":[ 1, 10, 11, 12],"raise":"sow direct, depth 15-25mm","germinate":"5-14 days @ 16-35°c","lifeCycle":"annual ≡50-90cm ↔20-30cm","mature":"80-120","id":"mj9tpxpuf" },
  {"title":"Couve Tronchuda Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 8, 9, 10],"raise":"sow direct or raise seedlings, depth 8mm","germinate":"3-7 days @ 8-30°c","lifeCycle":"perennial ≡100cm ↔80cm","mature":"80-90","id":"iko7x40e3" },
  {"title":"Cress Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"sow direct, depth 4mm","germinate":"6-14 days @ 7-15°c","lifeCycle":"biennial ≡15cm ↔5-15cm","mature":"15-50","id":"628im4hix" },
  {"title":"Cucumber Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct, depth 10mm","germinate":"4-10 days @ 18-35°c","lifeCycle":"annual ≡100-120cm ↔40-60cm","mature":"60-90","id":"rxvwm58e9" },
  {"title":"Cucuzza Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct, depth 25mm","germinate":"7-10 days @ 21-35°c","lifeCycle":"annual ≡100cm ↔60cm","mature":"70","id":"ueicx1y8r" },
  {"title":"Currants","type":"vegetable","month":[ 6, 7, 8],"raise":"","germinate":"","lifeCycle":"perennial ↔120cm","mature":"","id":"8p8eou97q" },
  {"title":"Dragon Fruit Cuttings","type":"vegetable","month":[ 1, 2, 9, 10, 11, 12],"raise":"","germinate":"","lifeCycle":"perennial","mature":"1-3 years","id":"zu43m859b" },
  {"title":"Eggplant Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-14 days @ 24-32°c","lifeCycle":"perennial ≡60-100cm ↔50-80cm","mature":"70 to 120","id":"9uc28w6xj" },
  {"title":"Endive Seeds","type":"vegetable","month":[ 2, 3, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"4-7 days @ 15-18°c","lifeCycle":"annual ↔20-30cm","mature":"50-80","id":"nb0fty38o" },
  {"title":"Fennel Seeds","type":"vegetable","month":[ 1, 2, 3, 9, 10, 11, 12],"raise":"sow direct, depth 8mm","germinate":"7-14 days @ 10-30°c","lifeCycle":"biennial ≡60cm ↔40cm","mature":"80-100","id":"drzdajruy" },
  {"title":"Florence Fennel Seeds","type":"vegetable","month":[ 1, 2, 3, 9, 10, 11, 12],"raise":"sow direct, depth 8mm","germinate":"7-14 days @ 10-30°c","lifeCycle":"biennial ≡60cm ↔40cm","mature":"80-100","id":"c2969y41m" },
  {"title":"Galangal Rhizomes","type":"vegetable","month":[ 11, 12],"raise":"","germinate":"","lifeCycle":"","mature":"","id":"rtyssihur" },
  {"title":"Garland Seeds","type":"vegetable","month":[ 2, 3, 4, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"7-10 days @ 15-22°c","lifeCycle":"annual ≡40cm ↔40cm","mature":"30-50","id":"gfnpmfkp0" },
  {"title":"Garlic Bulbs","type":"vegetable","month":[ 2, 3, 4, 5, 6],"raise":"","germinate":"","lifeCycle":"perennial ≡20cm ↔10-15cm","mature":"200-300","id":"uk8pqioj3" },
  {"title":"Ginger Rhizomes","type":"vegetable","month":[ 11, 12],"raise":"","germinate":"","lifeCycle":"","mature":"","id":"c9e5sju89" },
  {"title":"Goji Berry Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct or raise seedlings, depth 8mm","germinate":"14-28 days @ 20-25°c","lifeCycle":"perennial ↔200cm","mature":"90-110","id":"mpn4ep95h" },
  {"title":"Gooseberry Canes","type":"vegetable","month":[ 6, 7, 8],"raise":"","germinate":"","lifeCycle":"perennial ↔120cm","mature":"","id":"i6ufp70t3" },
  {"title":"Gourd Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct, depth 20mm","germinate":"7-14 days @ 24-35°c","lifeCycle":"annual ≡200cm ↔100-150cm","mature":"100-180","id":"esxl26ngq" },
  {"title":"Horseradish Roots","type":"vegetable","month":[ 8, 9, 10, 11],"raise":"","germinate":"","lifeCycle":"perennial","mature":"240","id":"4ac6lcz0v" },
  {"title":"Jerusalem Artichoke Tubers","type":"vegetable","month":[ 6, 7, 8, 9, 10],"raise":"","germinate":"","lifeCycle":"perennial ≡60cm ↔20cm","mature":"250","id":"hjo6539br" },
  {"title":"Kale Seeds","type":"vegetable","month":[ 1, 2, 3, 4],"raise":"sow direct or raise seedlings, depth 10mm","germinate":"6-12 days @ 8-30°c","lifeCycle":"biennial ≡50-100cm ↔40-60cm","mature":"50-70","id":"f5kqahabv" },
  {"title":"Kohlrabi Seeds","type":"vegetable","month":[ 1, 2, 3, 8, 9, 10, 11, 12],"raise":"sow direct, depth 5mm","germinate":"3-10 days @ 16-27°c","lifeCycle":"biennial ≡30-40cm ↔10-20cm","mature":"55-70","id":"58jpfzvnx" },
  {"title":"Leek Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"10-14 days @ 18-23°c","lifeCycle":"biennial ≡45cm ↔12cm","mature":"120-150","id":"39yub1w7o" },
  {"title":"Lettuce Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-14 days @ 8-23°c","lifeCycle":"annual ↔20-50cm","mature":"40-90","id":"moek9ykwn" },
  {"title":"Luffa Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct or raise seedlings, depth 15mm","germinate":"14-21 days @ 25-30°c","lifeCycle":"annual ≡75cm ↔50cm","mature":"100-180","id":"rcqyxd885" },
  {"title":"Madagascar Bean Seeds","type":"vegetable","month":[ 1, 10, 11, 12],"raise":"sow direct, depth 30mm","germinate":"7-14 days @ 6-24°c","lifeCycle":"perennial ≡80cm ↔60cm","mature":"80-105","id":"if8x9hz67" },
  {"title":"Malabar Spinach Seeds","type":"vegetable","month":[ 1, 9, 10, 11, 12],"raise":"sow direct, depth 10mm","germinate":"10-21 days @ 24-30°c","lifeCycle":"perennial ↔20cm","mature":"60-70","id":"sviut7m4x" },
  {"title":"Mangel Wurzel Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 9, 10, 11, 12],"raise":"sow direct, depth 15mm","germinate":"5-10 days @ 10-30°c","lifeCycle":"biennial ≡50cm ↔30cm","mature":"150","id":"jugeoy4t2" },
  {"title":"Mibuna Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"raise seedlings, depth 5mm","germinate":"4-10 days @ 18-24°c","lifeCycle":"annual ≡30cm ↔20cm","mature":"25-55","id":"ts5yxi5vk" },
  {"title":"Mizuna Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 6mm","germinate":"6-12 days @ 7-25°c","lifeCycle":"annual ≡20-30cm ↔20-30cm","mature":"35-50","id":"qc1ik53nv" },
  {"title":"Mustard Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"sow direct, depth 5mm","germinate":"7-14 days @ 18-20°c","lifeCycle":"annual ≡40-60cm ↔30-40cm","mature":"30 to 60","id":"lvyvziwqv" },
  {"title":"Okra Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct or raise seedlings, depth 10mm","germinate":"12-14 days @ 23-33°c","lifeCycle":"perennial ≡100cm ↔60cm","mature":"55-65","id":"rez5guoem" },
  {"title":"Orach Seeds","type":"vegetable","month":[ 1, 2, 9, 10, 11, 12],"raise":"sow direct, depth","germinate":"@ °c","lifeCycle":"","mature":"","id":"0x5xcoxe2" },
  {"title":"Parsnip Seeds","type":"vegetable","month":[ 1, 2, 8, 9, 10, 11, 12],"raise":"sow direct, depth 5mm","germinate":"14-28 days @ 10-21°c","lifeCycle":"biennial ≡35-50cm ↔5-10cm","mature":"120-140","id":"gjkwbddaw" },
  {"title":"Passionfruit Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"sow direct or raise seedlings, depth 8mm","germinate":"21-84 days @ 20-30°c","lifeCycle":"perennial ≡200cm ↔200cm","mature":"595-730","id":"ydpkpa1b2" },
  {"title":"Peas Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],"raise":"sow direct, depth 20mm","germinate":"7-21 days @ 15-20°c","lifeCycle":"annual ≡100cm ↔20cm","mature":"60-80","id":"a0vb1qvxz" },
  {"title":"Peanut Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"sow direct or raise seedlings, depth 30mm","germinate":"7-15 days @ 18-22°c","lifeCycle":"annual ≡60cm ↔15-30cm","mature":"90-130","id":"pdmnvtl7c" },
  {"title":"Potato Tubers","type":"vegetable","month":[ 8, 9, 10, 11, 12],"raise":"","germinate":"","lifeCycle":"perennial ≡75cm ↔30cm","mature":"80-120","id":"e11yrklrq" },
  {"title":"Preserving Melon Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"sow direct, depth 20mm","germinate":"10-14 days @ 27-32°c","lifeCycle":"annual ≡125cm ↔75cm","mature":"80-100","id":"73vzm9t0x" },
  {"title":"Pumpkin and Winter Squash Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct, depth 20mm","germinate":"5-10 days @ 21-35°c","lifeCycle":"annual ≡100-120cm ↔100-150cm","mature":"100-140","id":"y5f5ennck" },
  {"title":"Radish Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"sow direct, depth 10mm","germinate":"3-14 days @ 8-30°c","lifeCycle":"annual ≡20-30cm ↔3-7cm","mature":"40-60","id":"898g9t6x5" },
  {"title":"Raspberry Canes","type":"vegetable","month":[ 6, 7, 8],"raise":"","germinate":"","lifeCycle":"perennial ≡175cm ↔40cm","mature":"180-420","id":"bs5s4nfdt" },
  {"title":"Rhubarb Crowns","type":"vegetable","month":[ 8, 9, 10],"raise":"","germinate":"","lifeCycle":"perennial ≡70-100cm ↔50-70cm","mature":"100-140","id":"jx3ysrn1l" },
  {"title":"Rhubarb Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 10mm","germinate":"7-14 days @ 20-23°c","lifeCycle":"perennial ≡70-100cm ↔50-70cm","mature":"100-140","id":"fm5mghy9y" },
  {"title":"Rocket Seeds","type":"vegetable","month":[ 2, 3, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 4mm","germinate":"6-10 days @ 15-20°c","lifeCycle":"annual ≡30-40cm ↔30-40cm","mature":"30-60","id":"qvsix7ryf" },
  {"title":"Rockmelon Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct, depth 10-15mm","germinate":"8-16 days @ 20-32°c","lifeCycle":"annual ≡130-160cm ↔90-120cm","mature":"100-120","id":"newb6gwn7" },
  {"title":"Root Parsley Seeds","type":"vegetable","month":[ 1, 2, 3, 9, 10, 11, 12],"raise":"sow direct, depth 5mm","germinate":"14-28 days @ 10-30°c","lifeCycle":"biennial ≡30cm ↔30-40cm","mature":"100-130","id":"7xvwii02t" },
  {"title":"Rosella Seeds","type":"vegetable","month":[ 11, 12],"raise":"raise seedlings, depth 10mm","germinate":"10-21 days @ 25-35°c","lifeCycle":"annual ≡100cm ↔45cm","mature":"180-200","id":"aqcwprgci" },
  {"title":"Salsify Seeds","type":"vegetable","month":[ 1, 2, 3, 9, 10, 11, 12],"raise":"sow direct, depth 6mm","germinate":"21-28 days @ 10-30°c","lifeCycle":"biennial ≡40cm ↔10cm","mature":"110-180","id":"l5rzhl0ob" },
  {"title":"Scarlet Runner Bean Seeds","type":"vegetable","month":[ 1, 10, 11, 12],"raise":"sow direct, depth 25mm","germinate":"4-7 days @ 16-22°c","lifeCycle":"perennial ≡100cm ↔15cm","mature":"70-90","id":"ww2q8k1js" },
  {"title":"Shallot Bulbs","type":"vegetable","month":[ 7, 8, 9],"raise":"","germinate":"","lifeCycle":"perennial ≡60cm ↔20cm","mature":"120","id":"il3dmonkm" },
  {"title":"Shallot Seeds","type":"vegetable","month":[ 2, 3, 4, 5, 6, 7, 8, 9],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-10 days @ 20-25°c","lifeCycle":"perennial ≡40cm ↔5-10cm","mature":"120","id":"82diybzoj" },
  {"title":"Shark Fin Melon Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct, depth 15mm","germinate":"7-14 days @ 22-28°c","lifeCycle":"perennial ≡150cm ↔100cm","mature":"120","id":"spx3v207x" },
  {"title":"Silverbeet Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 15mm","germinate":"5-10 days @ 10-30°c","lifeCycle":"biennial ≡50-60cm ↔20-35cm","mature":"50-90","id":"h77mfixa9" },
  {"title":"Sorrel Seeds","type":"vegetable","month":[ 3, 4, 5, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-14 days @ 22-22°c","lifeCycle":"perennial ↔30cm","mature":"60","id":"txdyq4esj" },
  {"title":"Soybean Seeds","type":"vegetable","month":[ 11, 12],"raise":"sow direct, depth 20mm","germinate":"7-14 days @ 25-30°c","lifeCycle":"annual ≡50cm ↔15cm","mature":"85","id":"ymote25za" },
  {"title":"Spinach Seeds","type":"vegetable","month":[ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],"raise":"sow direct, depth 8mm","germinate":"5-10 days @ 4-25°c","lifeCycle":"biennial ≡40-50cm ↔25-35cm","mature":"50-100","id":"e4byar8s8" },
  {"title":"Sprouting Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],"raise":"","germinate":"@ 10-30°c","lifeCycle":"annual","mature":"4-14","id":"bivozu4c9" },
  {"title":"Strawberry Runners","type":"vegetable","month":[ 4, 5, 6, 7],"raise":"","germinate":"","lifeCycle":"perennial ≡30-40cm ↔15-30cm","mature":"140-160","id":"6yio6zj07" },
  {"title":"Strawberry Seeds","type":"vegetable","month":[ 3, 4, 9, 10, 11],"raise":"raise seedlings, depth 3mm","germinate":"14-56 days @ 15-18°c","lifeCycle":"perennial ≡30-40cm ↔15-30cm","mature":"140-160","id":"sfd7f1bv1" },
  {"title":"Strawberry Spinach Seeds","type":"vegetable","month":[ 9, 10, 11],"raise":"raise seedlings, depth 3mm","germinate":"7-14 days @ 18-22°c","lifeCycle":"annual ↔100cm","mature":"50","id":"bxkhumn8o" },
  {"title":"Sugar Beet Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 9, 10, 11, 12],"raise":"sow direct, depth 15mm","germinate":"5-10 days @ 10-30°c","lifeCycle":"biennial ≡50cm ↔15cm","mature":"80-100","id":"1kvfnelqy" },
  {"title":"Summer Squash Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 15mm","germinate":"7-10 days @ 21-35°c","lifeCycle":"annual ≡90-100cm ↔60-80cm","mature":"50-100","id":"ymtdfso5h" },
  {"title":"Swede Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 9, 10, 11],"raise":"sow direct or raise seedlings, depth 10mm","germinate":"4-10 days @ 16-30°c","lifeCycle":"biennial ≡30-50cm ↔10-20cm","mature":"80-100","id":"iq695i5wa" },
  {"title":"Sweet Potato Tubers","type":"vegetable","month":[ 10, 11],"raise":"","germinate":"","lifeCycle":"perennial","mature":"120","id":"nzn5zdd45" },
  {"title":"Tamarillo Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"7-28 days @ 18-28°c","lifeCycle":"perennial ↔400cm","mature":"2 years","id":"irao174nl" },
  {"title":"Tomatillo Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"raise seedlings, depth 4mm","germinate":"15-20 days @ 21-28°c","lifeCycle":"annual ↔50cm","mature":"70-90","id":"q9y28du0m" },
  {"title":"Tomato Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 5mm","germinate":"5-10 days @ 21-27°c","lifeCycle":"annual ≡60-70cm ↔50cm","mature":"60 to 100","id":"yrlcuggvw" },
  {"title":"Turnip Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 5, 9, 10, 11, 12],"raise":"sow direct, depth 10mm","germinate":"5-12 days @ 7-25°c","lifeCycle":"biennial ≡20-40cm ↔7-15cm","mature":"50-90","id":"pjh8mejcm" },
  {"title":"Warrigal Greens Seeds","type":"vegetable","month":[ 1, 2, 9, 10, 11, 12],"raise":"sow direct or raise seedlings, depth 10mm","germinate":"7-12 days @ 25-30°c","lifeCycle":"perennial ≡50cm ↔50cm","mature":"50","id":"wrwimr8gy" },
  {"title":"Water Cress Seeds","type":"vegetable","month":[ 1, 2, 3, 4, 9, 10, 11, 12],"raise":"raise seedlings, depth 3mm","germinate":"12-15 days @ 8-15°c","lifeCycle":"perennial ↔100cm","mature":"50-60","id":"sdv6lvf9a" },
  {"title":"Watermelon Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"sow direct, depth 20mm","germinate":"10-14 days @ 27-32°c","lifeCycle":"annual ≡150-180cm ↔60-80cm","mature":"70-120","id":"isqcq71hz" },
  {"title":"Winged Bean Seeds","type":"vegetable","month":[ 11, 12],"raise":"raise seedlings, depth 20mm","germinate":"7-21 days @ 25-30°c","lifeCycle":"perennial ≡100cm ↔25cm","mature":"120-240","id":"zaght2dc5" },
  {"title":"Winged Pea Seeds","type":"vegetable","month":[ 10, 11, 12],"raise":"sow direct, depth 20mm","germinate":"7-21 days @ 15-20°c","lifeCycle":"annual ≡100cm ↔20cm","mature":"60-80","id":"aug6rqycw" },
  {"title":"Youngberry Canes","type":"vegetable","month":[ 6, 7, 8],"raise":"","germinate":"","lifeCycle":"perennial ≡200-250cm ↔150-180cm","mature":"420","id":"8mtondpbd" },
  {"title":"Zucchini Seeds","type":"vegetable","month":[ 9, 10, 11, 12],"raise":"sow direct, depth 20mm","germinate":"7-14 days @ 21-35°c","lifeCycle":"annual ≡80-120cm ↔50-80cm","mature":"50-100","id":"pt9v3ojwc" }
  ];
  const monthList = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }

  function filterMonth(index){
    filterList.month = index;
    renderView();
   }
   
   function isOdd(num){
      return num % 2;
   }
   
   function setFilter(val){
     filterList.type = val;
     renderView();
   }
   
  function createButton(text, val){
    let additionalClass = (filterList.type==val)? ' is-active':''; 
    const button = document.createElement('button');
    button.className = `btn${additionalClass}`;
    button.textContent = text;
    button.onclick = () => setFilter(val);
    return button
  } 
  
  function GrowItem(title, plantId, type, month, growing, dateSown, datePlanted, dateHarvested, tags, id) {
    this.title = title;
    this.plantId = plantId;
    this.type = type;
    this.month = month || [];
    this.growing = growing || false;  
    this.dateSown = dateSown || '';  
    this.datePlanted = datePlanted || '';  
    this.dateHarvested = dateHarvested || '';    
    this.tags = tags || [];
    this.id = id || generateId(); //planit.js
  }
  
  //will be used when users add their own plants
  function sortList(list){ //by type then title
    list.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type); // true comes before false
      }
      return a.title.localeCompare(b.title); // A-Z by title
    });
  }

  // --- Render Functions ---
  function renderView(){
    const currentMonth = new Date().getMonth() + 1;
    if(!filterList.month){
    filterList.month = currentMonth; 
    } 
    
    sortList(growData)
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    dom.filterBar.innerHTML = '';
    //let index = 1;
    monthList.forEach((month,index) => {
      const cell  = document.createElement("div"); 
      cell.textContent = month;
      gridContainer.appendChild(cell);
      if(index!=0){
        const monthButton  = document.createElement("button");
        let additionalClass = (index==filterList.month)? ' is-active':''; 
        monthButton.textContent = month;
        monthButton.className = `month-button${additionalClass}`;
        monthButton.onclick = () => filterMonth(index); 
        dom.filterBar.appendChild(monthButton); 
       }      
    }); 
    
    const allButton  = document.createElement("button");
    let additionalClass = ('all'==filterList.month)? ' is-active':''; 
    allButton.textContent = 'All';
    allButton.className = `month-button${additionalClass}`;
    allButton.onclick = () => filterMonth('all'); 
    dom.filterBar.appendChild(allButton); 
       
    
    //Group Button
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    const buttonOne = createButton('Vegetables', 'vegetable');
    const buttonTwo = createButton('All', 'all');
    const buttonThree = createButton('Herbs', 'herb');

    buttonGroup.appendChild(buttonOne);
    buttonGroup.appendChild(buttonTwo);
    buttonGroup.appendChild(buttonThree);
    dom.filterBar.appendChild(buttonGroup);
    let index = 0;    
    plantList.forEach(plant => {
    if (plant.month.includes(filterList.month) || filterList.month==='all') {
    if(filterList.type===plant.type || filterList.type==='all'){
      let oddEvenRowClass = (isOdd(index))? ' is-odd':' is-even'
      const label  = document.createElement("div");
      label.className = 'label' + oddEvenRowClass ;
      label.textContent = plant.title.replace('Seeds','').trim();
      
      gridContainer.appendChild(label);
      for(let i=0; i<12; i++){
        
        let className = (plant.month.includes(i+1))? 'selected':'unselected';
        const cell  = document.createElement("div");
        cell.className = className + oddEvenRowClass;  
        gridContainer.appendChild(cell);
      }
      index++;
    }
    }
    
    });  
    
    //User selected plants  
    dom.selectedPlantsContainer.innerHTML = '';
    growData.forEach(growItem => {
      if (growItem.month.includes(filterList.month) || filterList.month==='all') {
      if(filterList.type===growItem.type || filterList.type==='all'){
        const item  = document.createElement("div"); 
        item.textContent = growItem.title;
        item.dataset.id =  growItem.id; 
        item.className = growItem.type;  
        dom.selectedPlantsContainer.appendChild(item); 
      }
      }     
    })

    //in season plants   
    dom.currentMonth.innerHTML = '';

    plantList.forEach(plant => {
     if (plant.month.includes(filterList.month) || filterList.month==='all') {
       if(filterList.type===plant.type || filterList.type==='all'){
        const plantItem = document.createElement('div');
        plantItem.className = plant.type;
        plantItem.textContent = plant.title.replace('Seeds','').trim();
        plantItem.dataset.id = plant.id;
        dom.currentMonth.appendChild(plantItem);        
      }
     }    
    })  
    Sortable.create(dom.currentMonth, {
      group: 'grow',
      sort: false
    });    
  }   
  
  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("growit"); //planit.js
      if (saved?.plants) {
        try {
          growData = saved.plants;
          //console.log(growData)          
          //growData.forEach(plant => {
            //const myPlant = plantList.find(t => t.id === plant.plantId);
            //plant.month = myPlant.month;
            // console.log(plant )            
          //})          
          //saveToLocalStorage();          
        } catch (e) {
          console.warn("Could not parse saved growit data:", e);
          growData = [];
        }
      } else {
        growData = [
          new GrowItem('Parsley', 'fbdh9t2it', 'herb'),
          new GrowItem('Tomato', 'yrlcuggvw', 'vegetable')
        ];
         console.log(growData)
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("growit", { plants: growData }); //planit.js
    }
  }

  // --- Import and Export ---    
  function exportData() {
    exportCardData(growData, 'growit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        growData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }
  
  // --- Initialization ---
  function initDomReferences() {
    dom.currentMonth = document.getElementById('currentMonth');
    dom.selectedPlantsContainer = document.getElementById('selectedPlantsContainer');
    dom.plantListContainer = document.getElementById('plantListContainer');
    dom.filterBar = document.getElementById('filterBar');
    
    Sortable.create(document.getElementById('selectedPlantsContainer'), {
      group: 'grow',
      onAdd: function (evt) {
        if(evt.item.dataset.id){
          const itemId = evt.item.dataset.id;
          //console.log(itemId, evt.item.innerHTML);
          const plant = plantList.find(t => t.id === itemId);
          growData.push(new GrowItem(evt.item.innerHTML, itemId, plant.type))
        }
        saveAndRender();
      }
    });
    
    Sortable.create(document.getElementById('deleteTarget'), {
      group: 'grow',
      onAdd: function (evt) {
        const id = evt.item.dataset.id;
        growData = growData.filter(p => p.id !== id);
        saveAndRender();
      }
    });
    
    
     
  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
  }

  function init() {
    initDomReferences();
    loadFromLocalStorage();
    initButtons();
    renderView();
  }

  init();

  window.growit = {
    init
  };
})();
