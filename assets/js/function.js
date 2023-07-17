$(document).ready(function() {
    const listNama = $('#listName')
    const link = $('#link')
    const pengantar = $('#pengantar')
    const tablebody = $('tbody')


    const genRandom = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
    const generate = () => {
        const res = []
        const namaArr = listNama.val().split('\n')
        namaArr.forEach(nama => {
            let pengantarbaru = pengantar.val()
            pengantarbaru = pengantarbaru.replaceAll(/\[nama\]/g, nama.trim())
            pengantarbaru = pengantarbaru.replaceAll(/\[link\]/g, link.val() + encodeURI(nama.trim()))
            res.push(
                {
                    uid: genRandom(10),
                    nama: nama.trim(),
                    link: link.val() + encodeURI(nama.trim()),
                    template: pengantarbaru 
                }
            )        
        });

        return Promise.resolve(res)
    }

    const appendElement = () => {
        const items = JSON.parse(localStorage.getItem('tamuUndangan'))
        tablebody.empty()
        items.forEach((e, idx) => {
            tablebody.append(`
            <tr>
                <th scope="row">${idx + 1}</th>
                <td>${e.nama}</td>
                <td class="d-flex flex-column flex-md-row align-items-center justify-content-start gap-2">
                    <button class="btn btn-sm btn-success" id="btnWa" data-uid="${e.uid}">Whatsapp</button>
                    <button class="btn btn-sm btn-secondary" id="btnTemplate" data-uid="${e.uid}">Copy Template</button>
                    <button data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Data copied !" class="btn btn-sm btn-secondary" id="btnCopy" data-uid="${e.uid}">Copy Link</button>
                </td>
            </tr>`)
        })
    }

    const checkHistory = () => {
        const history = localStorage.tamuUndangan
        if (!history) return false
        $('#tblWrap').removeClass('d-none')
        appendElement ()
    }
    const submit = async (e) => {
        e.preventDefault()
        const res = await generate()
        const history = !localStorage.tamuUndangan ? [] : JSON.parse(localStorage.tamuUndangan)
        const newItems = [...history, ...res]
        localStorage.setItem('tamuUndangan', JSON.stringify(newItems))
        checkHistory ()
        $("html, body").animate({ scrollTop: document.body.scrollHeight }, "slow");
    }
    
    const findItem = (id) => {
        const items = (!localStorage.tamuUndangan ? [] : JSON.parse(localStorage.tamuUndangan)).find(e => e.uid === id)
        return Promise.resolve(items)
    }

    async function copy (data, type)  {
        await navigator.clipboard.writeText(type === 'link' ? data.link : data.template)
        const tst = window.bootstrap.Toast.getOrCreateInstance(document.querySelector('#copytoast'))
        tst.show()
        
    }
    const wa = (data) => {
        const a = document.createElement('a')
        a.setAttribute('href', `https://wa.me/?text=${encodeURIComponent(data.template)}`)
        a.setAttribute('target', '_blank')
        a.click()
    }

    function action () {
        const uid = $(this).data('uid')
        const id = $(this).attr('id')
        console.log(id)
        findItem(uid).then(data => {
            if (id === 'btnCopy') return copy(data, 'link')
            if (id === 'btnTemplate') return copy(data, 'template')
            if (id === 'btnWa') return wa(data)
        })
    }

    function generatePengantar (e) {
        e.preventDefault ()
        const id = $(this).data('id')
        $.getJSON("pengantar.json", function (data) {
            pengantar.val(data[id])
        }).fail(function(){
            console.log("An error has occurred.");
        });
    }

    function clearUndangan () {
        localStorage.clear()
        location.reload(true)
    }


    $('form').on('submit', submit)
    $('#generatePengantar0').on('click', generatePengantar)
    $('#generatePengantar1').on('click', generatePengantar)
    $('#generatePengantar2').on('click', generatePengantar)
    $('#generatePengantar3').on('click', generatePengantar)
    $('#clearBtn').on('click', clearUndangan)

    $('tbody').on('click', '#btnCopy', action)
    $('tbody').on('click', '#btnTemplate', action)
    $('tbody').on('click', '#btnWa', action)

    checkHistory ()
})