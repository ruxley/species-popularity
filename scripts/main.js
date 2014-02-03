(function() {

  /*

  MALE: ['a','Completely male'],
  OTHER: ['b','Predominantly male'],
  OTHER: ['c','Equal parts male and female'],
  OTHER: ['d','Predominantly female'],
  FEMALE: ['e','Completely female'],
  OTHER: ['f','Other']


  MALE: ['0','Completely heterosexual'],
  MALE: ['1','Mostly heterosexual'],
  OTHER: ['2','Bisexual leaning heterosexual'],
  OTHER: ['3','Bisexual'],
  OTHER: ['4','Bisexual leaning homosexual'],
  FEMALE: ['5','Mostly homosexual'],
  FEMALE: ['6','Completely homosexual']

  */

  var animalList = {
    'animal_wolf': 'Wolf',
    'animal_redfox': 'Red fox',
    'animal_greyfox': 'Grey fox',
    'animal_arcticfox': 'Arctic fox',
    'animal_kitsune': 'Kitsune',
    'animal_otherfox': 'Other fox',
    'animal_coyote': 'Coyote',
    'animal_germanshepherd': 'German shepherd',
    'animal_husky': 'Husky',
    'animal_collie': 'Collie',
    'animal_otherdog': 'Other dog',
    'animal_othercanine': 'Other canine',
    'animal_tiger': 'Tiger',
    'animal_lion': 'Lion',
    'animal_leopard': 'Leopard',
    'animal_panther': 'Panther',
    'animal_cheetah': 'Cheetah',
    'animal_cougar': 'Cougar',
    'animal_domesticcat': 'Domestic cat',
    'animal_otherfeline': 'Other feline',
    'animal_dragon': 'Dragon',
    'animal_lizard': 'Lizard',
    'animal_dinosaur': 'Dinosaur',
    'animal_otherreptile': 'Other reptile',
    'animal_raccoon': 'Raccoon',
    'animal_skunk': 'Skunk',
    'animal_badger': 'Badger',
    'animal_riverotter': 'River otter',
    'animal_seaotter': 'Sea otter',
    'animal_weasel': 'Weasel',
    'animal_othermustelid': 'Other mustelid',
    'animal_redpanda': 'Red panda',
    'animal_othermusteloid': 'Other musteloid',
    'animal_horse': 'Horse',
    'animal_deer': 'Deer',
    'animal_otherungulate': 'Other ungulate',
    'animal_brownbear': 'Brown bear',
    'animal_grizzlybear': 'Grizzly bear',
    'animal_pandabear': 'Panda bear',
    'animal_polarbear': 'Polar bear',
    'animal_otherbear': 'Other bear',
    'animal_mouse': 'Mouse',
    'animal_rat': 'Rat',
    'animal_squirrel': 'Squirrel',
    'animal_raven': 'Raven',
    'animal_raptor': 'Raptor',
    'animal_otherbird': 'Other bird',
    'animal_rabbit': 'Rabbit',
    'animal_kangaroo': 'Kangaroo',
    'animal_koala': 'Koala',
    'animal_othermarsupial': 'Other marsupial',
    'animal_lemur': 'Lemur',
    'animal_monkey': 'Monkey',
    'animal_otherprimate': 'Other primate',
    'animal_hyaena': 'Hyaena',
    'animal_bat': 'Bat',
    'animal_griffin': 'Griffin',
    'animal_other': 'Other'
  };

  var sexList = [
    ['.','All'],
    ['a','Male'],
    ['b','Female'],
    ['c','Other']
  ];

  var genderList = [
    ['.','All'],
    ['a','Completely male'],
    ['b','Predominantly male'],
    ['c','Equal parts male and female'],
    ['d','Predominantly female'],
    ['e','Completely female'],
    ['f','Other']
  ];
    
  var orientationList = [
    ['.','All'],
    ['0','Completely heterosexual'],
    ['1','Mostly heterosexual'],
    ['2','Bisexual leaning heterosexual'],
    ['3','Bisexual'],
    ['4','Bisexual leaning homosexual'],
    ['5','Mostly homosexual'],
    ['6','Completely homosexual']
  ];



  var margin = {top: 22, right: 0, bottom: 0, left: 100};
  var width = 850 - margin.left - margin.right;
  var height = 1600 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y0 = d3.scale.ordinal()
      .rangeRoundBands([0, height], .2);

  var y1 = d3.scale.ordinal();

  var color = d3.scale.ordinal()
      .range(['#98abc5', '#8a89a6']);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('top');

  var yAxis = d3.svg.axis()
      .scale(y0)
      .orient('left');

  var svg = d3.select('body').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  

  d3.json('data/speciesdata.json', function(err, data) {

    // 58 animals
    // 108 categories

    /* structuredData looks like this
        [
          {
            animalName: 'Kistune',
            totals: [
              { name: 'baseline', value: 1234 },
              { name: 'query', value: 345 }
            ]
          }
        ]
    */

    // 000 contains the data for ALL categories, so will double the totals if it's left in
    delete data['000'];


    _.mixin({
      sum: function(obj, key, memo) {
        return _.reduce(obj, function(mem, val) {
          return mem + (val[key] || 0);
        }, memo || 0);
      }
    });

    var baselineFilter = 'a..';

    var baselineData = _.filter(data, function(val, key) {
      return key.match(baselineFilter);
    });

    var baselineCount = _.sum(baselineData, 'count');

    console.log("baselineCount:", baselineCount);
    console.log("baselineData:", baselineData);


    var baselineFilter = 'b..';

    var queryData = _.filter(data, function(val, key) {
      return key.match(baselineFilter);
    });

    var queryCount = _.sum(queryData, 'count');

    console.log("queryCount:", queryCount);
    console.log("queryData:", queryData);


    var structuredData = _.map(animalList, function(animalName, animalKey) {
      var d = {
        animalName: animalList[animalKey],
        totals: [
          {
            name: 'baseline',
            value: _.sum(baselineData, animalKey) / baselineCount
          },
          {
            name: 'query',
            value: _.sum(queryData, animalKey) / queryCount
          }
        ]
      };
      return d;
    });

    console.log("structuredData:", structuredData);


    x.domain([0, d3.max(structuredData, function(d) {
      return d3.max(d.totals, function(d) { return d.value; });
    })]);

    y0.domain(structuredData.map(function(d) { return d.animalName; }));

    y1.domain(['baseline', 'query']).rangeRoundBands([0, y0.rangeBand()]);


    svg.append('g')
        .attr('class', 'x axis')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    var animals = svg.selectAll('.animals')
        .data(structuredData)
      .enter().append('g')
        .attr('class', 'g')
        .attr('transform', function(d) { return 'translate(0,' + y0(d.animalName) + ')'; });

    animals.selectAll('rect')
        .data(function(d) { return d.totals; })
      .enter().append('rect')
        .attr('x', 0)
        .attr('y', function(d) { return y1(d.name); })
        .attr('width', function(d) { return x(d.value); })
        .attr('height', y1.rangeBand())
        .style('fill', function(d) { return color(d.name); });

  });

})();