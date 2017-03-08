/* global Chartist */
describe('ctBarLabels', function () {
  'use strict';
    var options = {};
    var data = {
        // A labels array that can contain any sort of values
        labels: [1,2,3,4,5],
        // Our series array that contains series objects or in this case series data arrays
        series: [
            [5, 2, 4, 2, 4],
            [3, 4, 6, 7, 9],
            [2, 5, 1, 8,7 ]
        ]
    };
  beforeEach(function () {
      var chartNode = document.createElement('div');

      document.getElementsByTagName('div').className = 'ct-chart';
      document.body.appendChild(chartNode);

  });

  afterEach(function () {

  });

  it('should be defined in chartist plugins object', function () {
      options.plugins =  [
          Chartist.plugins.ctBarLabels({
              textAnchor: 'middle'
          })
      ];

      new Chartist.Bar('.ct-chart', data, options);

    expect(window.Chartist.plugins.ctBarLabels).toBeDefined();
  });


    it('should add a text element with the prefix' , function(){
        options.plugins =  [
            Chartist.plugins.ctBarLabels({
                textAnchor: 'middle',
                prefix: 'testprefix'
            })
        ];

        new Chartist.Bar('.ct-chart', data, options);
       expect(true).toBeTruthy();
    });
});
