function startTour(tourMsgs) {
  var tour = introJs().setOptions({ 'skipLabel': 'Skip Tour', 'doneLabel': 'Start!', 'tooltipClass': 'w3-pale-green w3-center', 'showStepNumbers': false, 'scrollToItem': true, 'exitOnOverlayClick': false, 'hideNext': true, 'hidePrev': true })
  tour.setOptions({
    steps: [{
        intro: tourMsgs[0].msg,
        class: 'large-box'
      },
      {
        element: document.querySelector('#options'),
        intro: tourMsgs[1].msg,
        position: 'auto'
      },
      {
        element: '#sidePanel',
        intro: tourMsgs[2].msg,
        position: 'auto'
      },
      {
        element: '#mainOptions',
        intro: tourMsgs[3].msg,
        position: 'bottom'
      },
      {
        element: '#step4',
        intro: tourMsgs[4].msg,
        position: 'auto'
      },
      {
        element: '#helpDropBtn',
        intro: tourMsgs[5].msg,
        position: 'left',
        class: 'under-button'
      },
      {
        element: '#compileButton',
        intro: tourMsgs[6].msg,
        position: 'bottom',
        class: 'under-button'
      },
      {
        intro: tourMsgs[7].msg,
        position: 'auto',
        class: 'large-box'
      },
      {
        intro: tourMsgs[8].msg,
        class: 'w3-blue'
      }
    ]
  })
  tour.start()
}

function AndroidAutoChoice() {
  var AAchoice = introJs().setOptions({ 'doneLabel': 'Got It!', 'tooltipClass': 'w3-pale-green w3-center', 'showStepNumbers': false, 'scrollToItem': true, 'exitOnOverlayClick': false, 'hideNext': true, 'hidePrev': true })
  AAchoice.setOptions({
    steps: [{
      element: document.querySelector('#options'),
      intro: tourMsgs[1].msg,
      position: 'auto'
    }]
  });
}
function casdkIntro() {
  var casdkMsg = introJs().setOptions({ 'doneLabel': 'Got It!', 'tooltipClass': 'w3-pale-blue w3-center', 'showStepNumbers': false, 'scrollToItem': true, 'exitOnOverlayClick': true, 'hideNext': true, 'hidePrev': true })
  casdkMsg.setOptions({
    steps: [{
      element: $('#compileAutorun + .dropdown-toggle').get(0),
      intro: "Click here to try CASDK!!",
      position: 'bottom'
    }]
  });
  casdkMsg.start()
}
