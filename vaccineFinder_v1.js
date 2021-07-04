// VACCINE FINDER VERSION 01
// DEVELOPER: https://github.com/vipinkrishna
// CopyLeft vipinkrishna - (Free Developer)

(function () {
  const pincodes = [671531]  //Enter your pincode(s) here! - Example: [671531, 671316]

  let today = new Date()
  const dates = []
  for (let i = 0; i < 8; i++) {
    dates.push(today.toLocaleDateString('nl', { day: "2-digit", month: "2-digit", year: "numeric" }))
    today.setDate(today.getDate() + 1)
  }

  let counter = 1
  let session_counter

  let yourAgeCategory = 18
  let yourDose = "FIRST"  //"FIRST" //"SECOND"

  const wait = (milliseconds) => new Promise((settle) => setTimeout(settle, milliseconds))

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
    console.log(`[PASS: ${counter++}]`)

    session_counter = 1

    for (pincode of pincodes) {
      for (date of dates) {
        let endpoint = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" + pincode + "&date=" + date
        let response = await fetch(endpoint)
        let result = await response.json()

        for (session of result.sessions) {
          const { date: datestamp, address, pincode, available_capacity, available_capacity_dose1, available_capacity_dose2, vaccine, min_age_limit } = session
          if (min_age_limit === yourAgeCategory && ((yourDose === "FIRST") ? available_capacity_dose1 : available_capacity_dose2) > 0) {
            console.log('================================================================')
            console.log(`SESSION:${session_counter++} - ${yourDose} DOSE - AGE:${min_age_limit}`)
            console.log('----------------------------------------------------------------')
            console.log("Date: ", datestamp)
            console.log("Vaccine Name: ", vaccine)
            console.log("Address: ", address, " Pincode: ", pincode)
            console.log("Available Capacity: ", available_capacity)
            console.log("Available Capacity for DOSE 1: ", available_capacity_dose1)
            console.log("Available Capacity for DOSE 2: ", available_capacity_dose2)
            console.log("================================================================\n\n\n\n\n")
            beep(100)
            await wait(2000)  //SESSION
          }
        }
      }
    }
    await wait(30000)  //PASS
    pincodes.length && dates.length && yourAgeCategory && yourDose && vaccineFinder()
  })()
  return "https://github.com/vipinkrishna"
})()

