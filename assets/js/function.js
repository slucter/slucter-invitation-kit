const listNama = document.querySelector('#listName')
const link = document.querySelector('#link')
const pengantar = document.querySelector('#pengantar')

const generate = () => {
    const res = []
    const namaArr = listNama.value.split('\n')
    namaArr.forEach(nama => {
        let pengantarbaru = pengantar.value
        pengantarbaru = pengantarbaru.replaceAll(/\[nama\]/g, nama.trim())
        pengantarbaru = pengantarbaru.replaceAll(/\[link\]/g, link.value + encodeURI(nama.trim()))
        res.push(
            {
                nama: nama.trim(),
                link: link.value + encodeURI(nama.trim()),
                template: pengantarbaru 
            }
        )        
    });

    return Promise.resolve(res)
}
const submit = async () => {
    const res = await generate()
    console.log(res)
}

