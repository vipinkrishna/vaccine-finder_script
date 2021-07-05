// VACCINE FINDER VERSION 01
// DEVELOPER: https://github.com/vipinkrishna
// CopyLeft vipinkrishna - (Free Developer)

(function () {

  // YOUR SETTINGS GOES HERE - PINCODES, AGE CATEGORY, DOSE
  const pincodes = [671531, 671316]  //[671531]  //[671531, 671316]
  let yourAgeCategory = 18  //18  //40  //45
  let yourDose = "FIRST"  //"FIRST"  //"SECOND"

  // PICKS DATES FROM TODAY UPTO 8 DAYS
  let today = new Date()
  const dates = []
  for (let i = 0; i < 8; i++) {
    dates.push(today.toLocaleDateString('nl', { day: "2-digit", month: "2-digit", year: "numeric" }))
    today.setDate(today.getDate() + 1)
  }

  let counter = 1
  let session_counter

  // DELAY FUNCTION
  const wait = (milliseconds) => new Promise((settle) => setTimeout(settle, milliseconds))

  // GENERATES BEEP SOUND
  var audioCtx = new window.AudioContext
  function beep(duration = 500) {
    var oscillator = audioCtx.createOscillator()
    var gainNode = audioCtx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.frequency.value = 700
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + (duration / 1000))
  }

  if (!pincodes.length) {
    console.info('Missing "pincodes"...')
    return "https://github.com/vipinkrishna"
  }

  (async function vaccineFinder() {
    console.log(`%c[PASS: ${counter++}]`, 'color: red')

    session_counter = 1

    for (pincode of pincodes) {
      for (date of dates) {
        console.log(`%c${pincode} - %c${date}`, 'color: yellow','color: orange')
        let endpoint = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" + pincode + "&date=" + date
        let response = await fetch(endpoint)
        let { sessions } = await response.json()

        for (session of sessions) {
          const { date: datestamp, address, pincode, available_capacity, available_capacity_dose1, available_capacity_dose2, vaccine, min_age_limit } = session
          if (min_age_limit === yourAgeCategory && ((yourDose === "FIRST") ? available_capacity_dose1 : available_capacity_dose2) > 0) {
            console.log('\n%c================================================================', 'color: yellow')
            console.log(`SESSION:${session_counter++} - ${yourDose} DOSE - AGE:${min_age_limit}`)
            console.log('%c================================================================', 'color: yellow')
            console.log("Date: %c" + datestamp, 'color: orange')
            console.log("Vaccine Name: %c" + vaccine, 'color: cyan')
            console.log("Address: " + address + " Pincode: %c" + pincode, 'color: yellow')
            console.log("Available Capacity: ", available_capacity)
            console.log("Available Capacity for DOSE 1: ", available_capacity_dose1)
            console.log("Available Capacity for DOSE 2: ", available_capacity_dose2)
            console.log("%c================================================================\n\n", 'color: yellow')
            beep(2000)
          }  //IF
          // await wait(2000)  //SESSION
        }  //FOR
      }  //FOR
    }  //FOR
    await wait(300000)  //PASS
    pincodes.length && dates.length && yourAgeCategory && yourDose && vaccineFinder()  //RECURSIVE
  })()
  return "https://github.com/vipinkrishna"
})()
