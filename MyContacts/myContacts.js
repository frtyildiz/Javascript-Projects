class Person{
    constructor(fName, lName, eMail)
    {
        this.fName = fName;
        this.lName = lName;
        this.eMail = eMail;
    }

}

class Util{
    static checkForm(...inputs) 
    {
        let result = true;
        inputs.forEach(input => {
            if(input.length === 0)
            {
                result = false;
                return result;
            }
        });
        return result;
    }

    static checkEmail(eMail)
    {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(eMail).toLowerCase());
    }
}

class IndexPage{
    constructor()
    {
        this.fName = document.getElementById("fName");
        this.lName = document.getElementById("lName");
        this.eMail = document.getElementById("eMail");
        this.addButton = document.querySelector(".addButton");
        this.form = document.getElementById("form-contact");
        this.form.addEventListener("submit", this.createAndUpdate.bind(this));
        this.contactList = document.querySelector(".contact-list");
        this.contactList.addEventListener("click", this.editOrDelete.bind(this))
        this.LStorage = new LStorage();
        this.selectRow = undefined;
        this.putContactsToIndexPage();
    }

    createInfo(message, stat)
    {
        const infoDiv = document.querySelector(".info");

        infoDiv.innerHTML = message;

        infoDiv.classList.add(stat ? "info--success" : "info--error");

        setTimeout(function () {
            infoDiv.className = "info";
        }, 3000);
    }

    clearForm()
    {
        this.fName.value = "";
        this.lName.value = "";
        this.eMail.value = "";
    }

    editOrDelete(e)
    {
        const clickButton = e.target;

        if(clickButton.classList.contains("btn--delete"))
        {
            this.selectRow = clickButton.parentElement.parentElement;
            this.deleteContactFromIndexPage();
        }
        else if(clickButton.classList.contains("btn--edit"))
        {
            this.selectRow = clickButton.parentElement.parentElement;
            this.addButton.value = "Edit Contact";
            this.fName.value = this.selectRow.cells[0].textContent;
            this.lName.value = this.selectRow.cells[1].textContent;
            this.eMail.value = this.selectRow.cells[2].textContent;
        }
    }

    editContactFromIndexPage(person)
    {   
        this.LStorage.editContact(person, this.selectRow.cells[2].textContent);

        this.selectRow.cells[0].textContent = person.fName;
        this.selectRow.cells[1].textContent = person.lName;
        this.selectRow.cells[2].textContent = person.eMail;

        this.clearForm();
        this.selectRow = undefined;
        this.addButton.value = "Add";

        this.createInfo("The Contact Edited", true);
    }

    deleteContactFromIndexPage()
    {
        this.selectRow.remove();
        const contactEmail = this.selectRow.cells[2].textContent;
        this.LStorage.deleteContact(contactEmail)

        this.clearForm();

        this.selectRow = undefined;

        this.createInfo("The Contact Deleted From List", true);
    }

    putContactsToIndexPage()
    {
        this.LStorage.allContact.forEach(aPerson => {
            this.addContact(aPerson);
        });
    }

    addContact(aContact)
    {
        const createTrElement = document.createElement("tr");
        createTrElement.innerHTML = `<td>${aContact.fName}</td>
        <td>${aContact.lName}</td>
        <td>${aContact.eMail}</td>
        <td>
            <button class="btn btn--edit"><i class="fa-solid fa-user-edit"></i></button>
            <button class="btn btn--delete"><i class="fa-solid fa-user-minus"></i></button>
        </td>`

        this.contactList.appendChild(createTrElement);
    }

    createAndUpdate(e)
    {
        e.preventDefault();
        const person = new Person(this.fName.value, this.lName.value, this.eMail.value);
        const resultForCheckForm = Util.checkForm(person.fName, person.lName, person.eMail);
        const resultForCheckEmail = Util.checkEmail(person.eMail);
        console.log(resultForCheckEmail);

        if(resultForCheckForm)
        {
            if(!resultForCheckEmail)
            {
                this.createInfo("Please Check Your E-Mail.", false);
                return;
            }
        
            if(this.selectRow)
            {
                this.editContactFromIndexPage(person);
            }
            else
            {
                this.createInfo("Success", true);
                this.addContact(person);
                this.LStorage.addContact(person);
            }

            this.clearForm();
        }
        else
        {
            this.createInfo("Please Fill the All Form.", false);
        }
    }
}

class LStorage{

    constructor()
    {
        this.allContact = this.getContacts();
    }

    getContacts()
    {
        let localAllContact;

        if(localStorage.getItem("allContact") === null)
        {
            localAllContact = [];
        }
        else
        {
            localAllContact = JSON.parse(localStorage.getItem("allContact"));
        }

        return localAllContact;
    }

    addContact(contact) 
    {
        this.allContact.push(contact)
        localStorage.setItem("allContact", JSON.stringify(this.allContact));
    } 

    deleteContact(eMail)
    {
        this.allContact.forEach((aCon, index) => {
            if(aCon.eMail === eMail)
            {
                this.allContact.splice(index, 1);
            }
        });
        localStorage.setItem("allContact", JSON.stringify(this.allContact));
    }

    editContact(editedContact, eMail)
    {
        this.allContact.forEach((aCon, index) => {
            if(aCon.eMail === eMail)
            {
                this.allContact[index] = editedContact;
            }
        });
        localStorage.setItem("allContact", JSON.stringify(this.allContact));
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    const index = new IndexPage();
});