
const formInputActivity = document.getElementById('input-kegiatan')

formInputActivity.addEventListener('submit', (event) => {
    event.preventDefault()
    addActivity()
})

document.getElementById('isComplete').addEventListener('click', (e) => {
    let btn = document.getElementById('btn-addtochart')
    if (e.target.checked) {
        btn.innerText = 'Masukkan Kegiatan ke Rak Selesai Dilakukan'
    }else {
        btn.innerText = 'Masukkan Kegiatan ke Rak Akan Dilakukan'
    }
})

let activitys = []

const getInfoActivitys = () => {
    const totalActivitys = document.querySelector('.total-activitys')
    totalActivitys.innerText = activitys.length

    const completeRead = activitys.filter((activity) => activity.isComplete)
    const completeActivity = document.querySelector('.completed-activitys')
    completeActivity.innerText = completeRead.length

    const unCompleteRead = activitys.filter((activity) => !activity.isComplete)
    const unCompleteActivity = document.querySelector('.unCompleted-activitys')
    unCompleteActivity.innerText = unCompleteRead.length
}

const generateId = () => {
    return +new Date();
  }

const addActivity = () => {
    const id = generateId()
    const title = document.getElementById('title').value
    const year = document.getElementById('year').value
    const isComplete = document.getElementById('isComplete').checked

    activitys.push({
        id,
        title,
        year,
        isComplete
    })

    localStorage.setItem('activitys', JSON.stringify(activitys))
    getActivitys()
    document.dispatchEvent(new Event('RENDER_EVENT'))
    document.getElementById('title').value = ''
    document.getElementById('year').value = ''
    document.getElementById('isComplete').value = ''
}

function removeActivity(activityId) {
    const activityTarget = findActivityIndex(activityId);
   
    if (activityTarget === -1) return;
   
    activitys.splice(activityTarget, 1);
    document.dispatchEvent(new Event('RENDER_EVENT'));
    localStorage.setItem('activitys', JSON.stringify(activitys))
    getActivitys()
  }

  function findActivityIndex(activityId) {
    for (const index in activitys) {
      if (activitys[index].id === activityId) {
        return index;
      }
    }
    return -1;
  }

  function undoActivityFromCompleted(activityId) {
    const activityTarget = findActivity(activityId);
   
    if (activityTarget == null) return;
   
    activityTarget.isComplete = false;
    document.dispatchEvent(new Event('RENDER_EVENT'));
    localStorage.setItem('activitys', JSON.stringify(activitys))
    getActivitys()
  }

  function addActivityToCompleted (activityId) {
    const activityTarget = findActivity(activityId);
   
    if (activityTarget == null) return;
   
    activityTarget.isComplete = true;
    document.dispatchEvent(new Event('RENDER_EVENT'));
    localStorage.setItem('activitys', JSON.stringify(activitys))
    getActivitys()
  }

  function findActivity(activityId) {
    for (const activityItem of activitys) {
      if (activityItem.id === activityId) {
        return activityItem;
      }
    }
    return null;
  }

document.addEventListener('RENDER_EVENT', () => {
    const parentUnCompleted = document.querySelector('.parent-card-activitys')
    parentUnCompleted.innerHTML = ''
 
    const parentCompleted = document.querySelector('.parent-card-activitys-completed')
    parentCompleted.innerHTML = ''

    getListActivityUnCompleted()
    getListActivityCompleted()
})

const cardUnCompleted = (e) => {
    const parent = document.querySelector('.parent-card-activitys')

    const cardactivitysUnComplete = document.createElement('div')
    const title = document.createElement('h3')
    const year = document.createElement('p')
    
    title.innerText = e.title
    year.innerText = `${e.year}`

    cardactivitysUnComplete.append(title)
    cardactivitysUnComplete.append(year)

    const wrapContent = document.createElement('div')
    const completedButton = document.createElement('button')
    const deleteButton = document.createElement('button')
    
    completedButton.innerText = 'Selesai Dilakukan'
    deleteButton.innerText = 'Hapus Kegiatan'
    
    completedButton.classList.add('btn-green')
    deleteButton.classList.add('btn-red')

    completedButton.addEventListener('click', () => {
        addActivityToCompleted(e.id)
    })

    deleteButton.addEventListener('click', () => { dialogDelete(e) })

    wrapContent.classList.add('wrap-btn')

    wrapContent.append(completedButton)
    wrapContent.append(deleteButton)

    cardactivitysUnComplete.append(wrapContent)
    cardactivitysUnComplete.classList.add('card-activity')
    parent.append(cardactivitysUnComplete)
}

const cardCompleted = (e) => {
    const parent = document.querySelector('.parent-card-activitys-completed')

    const cardactivitysUnComplete = document.createElement('div')
    const title = document.createElement('h3')
    const year = document.createElement('p')
    
    title.innerText = e.title
    year.innerText = `${e.year}`

    cardactivitysUnComplete.append(title)
    cardactivitysUnComplete.append(year)

    const wrapContent = document.createElement('div')
    const completedButton = document.createElement('button')
    const deleteButton = document.createElement('button')
    
    completedButton.innerText = 'Akan Dilakukan'
    deleteButton.innerText = 'Hapus Kegiatan'
    
    completedButton.classList.add('btn-green')
    deleteButton.classList.add('btn-red')

    completedButton.addEventListener('click', () => {
        undoActivityFromCompleted(e.id)
    })

    deleteButton.addEventListener('click', () => {
        dialogDelete(e)
    })

    wrapContent.classList.add('wrap-btn')

    wrapContent.append(completedButton)
    wrapContent.append(deleteButton)

    cardactivitysUnComplete.append(wrapContent)
    cardactivitysUnComplete.classList.add('card-activity')
    parent.append(cardactivitysUnComplete)
}

const dialogDelete = (e) => {
    const backgroundDialog = document.createElement('div')
    backgroundDialog.classList.add('background-dialog')
    
    const parentDialog = document.createElement('div')
    const textDialog = document.createElement('p')

    const wrapBtnDialog = document.createElement('div')
    const cancelBtn = document.createElement('button')
    const okBtn = document.createElement('button')
    
    textDialog.innerText = 'Apakah Anda Yakin Ingin Menghapus Kegiatan Ini ?'

    cancelBtn.innerText = 'Batal'
    okBtn.innerText = 'Yakin'

    wrapBtnDialog.append(cancelBtn)
    wrapBtnDialog.append(okBtn)

    parentDialog.append(textDialog)
    parentDialog.append(wrapBtnDialog)

    parentDialog.classList.add('parent-dialog')

    document.querySelector('body').append(parentDialog)
    document.querySelector('body').append(backgroundDialog)
    
    cancelBtn.addEventListener('click', () => {
        parentDialog.style.display = 'none'
        backgroundDialog.style.display = 'none'
    })

    okBtn.addEventListener('click', () => {
        removeActivity(e.id)
        parentDialog.style.display = 'none'
        backgroundDialog.style.display = 'none'
    })

    backgroundDialog.addEventListener('click', () => {
        parentDialog.style.display = 'none'
        backgroundDialog.style.display = 'none'
    })

}

const getListActivityUnCompleted = () => {
    let unCompleteactivityList = activitys.filter((activity) => !activity.isComplete)
    return unCompleteactivityList.map(e => cardUnCompleted(e))
}
const getListActivityCompleted = () => {
    let unCompleteactivityList = activitys.filter((activity) => activity.isComplete)
    return unCompleteactivityList.map(e => cardCompleted(e))
}

const getActivitys = () => {
    if (localStorage.activitys) {
        activitys = JSON.parse(localStorage.getItem('activitys'))
    }
    getInfoActivitys()
}

getActivitys()
getListActivityCompleted()
getListActivityUnCompleted()


document.getElementById('search').addEventListener('input', (event) => {
    const filter = event.target.value.toLowerCase()
    const listCard = document.querySelectorAll('.card-activity')

    listCard.forEach((item) => {
        let text = item.querySelector('h3').textContent
        if (text.toLowerCase().includes(filter.toLowerCase())) {
            item.style.display = ''
        }else {
            item.style.display = 'none'
        }
    })
})