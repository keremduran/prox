<script setup lang="ts">

import { reactive, computed, watchEffect, onMounted} from 'vue'
import { mdiTableBorder,mdiViewDashboard, mdiShoppingSearch, mdiListBoxOutline } from '@mdi/js'
import NotificationBar from '@/components/NotificationBar.vue'
import TableMaterials from '@/components/TableMaterials.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'

import html2pdf from 'html2pdf.js';

import {getMaterials, addProject, getProjects} from '../firebase'

//@ts-ignore
let materials = await getMaterials();

//@ts-ignore
let projects = await getProjects();

const rates = [
  {
    "name": "Insulation",
    "type": "",
    "rate": "0.605"
  },
  {
    "name": "Drywall",
    "type": "8'",
    "rate": "0.345"
  },
  {
    "name": "Drywall",
    "type": "9'",
    "rate": "0.366"
  },
  {
    "name": "Drywall",
    "type": "10'",
    "rate": "0.414"
  },
  {
    "name": "Drywall",
    "type": "11'",
    "rate": "0.442"
  },
  {
    "name": "Drywall",
    "type": "12'",
    "rate": "0.457"
  },
  {
    "name": "Frame",
    "type": "8'",
    "rate": "0.336"
  },
  {
    "name": "Frame",
    "type": "9'",
    "rate": "0.354"
  },
  {
    "name": "Frame",
    "type": "10'",
    "rate": "0.376"
  },
  {
    "name": "Frame",
    "type": "11'",
    "rate": "0.395"
  },
  {
    "name": "Frame",
    "type": "12'",
    "rate": "0.415"
  },
  {
    "name": "Resilient Channel",
    "type": "8'",
    "rate": "0.336"
  },
  {
    "name": "Resilient Channel",
    "type": "9'",
    "rate": "0.354"
  },
  {
    "name": "Resilient Channel",
    "type": "10'",
    "rate": "0.376"
  },
  {
    "name": "Resilient Channel",
    "type": "11'",
    "rate": "0.395"
  },
  {
    "name": "Resilient Channel",
    "type": "12'",
    "rate": "0.415"
  },
  {
    "name": "Suspended Ceiling",
    "type": "",
    "rate": "0.65"
  },
  {
    "name": "T-bar",
    "type": "",
    "rate": "0.65"
  },
  {
    "name": "Ceiling Tile",
    "type": "",
    "rate": "0.65"
  },
  {
    "name": "R24",
    "type": "",
    "rate": "0.059"
  },
  {
    "name": "Rockwool",
    "type": "",
    "rate": "0.077"
  },
  {
    "name": "5/8",
    "type": "",
    "rate": "0.103"
  },
  {
    "name": "Townhouse",
    "type": "",
    "rate": "0.014"
  },
  {
    "name": "Energy Star",
    "type": "",
    "rate": "0.077"
  },
  {
    "name": "Stack Townhouse",
    "type": "",
    "rate": "0.04"
  },
  {
    "name": "Beam pocket",
    "type": "",
    "rate": "50"
  },
  {
    "name": "Gable",
    "type": "",
    "rate": "75"
  }
]


const documentDate = () => new Date(Date.now()).toLocaleDateString();
const documentNo = () => Date.now().toString(36);
const currentURL = () => window.location.pathname;

function getProjectOptions(field: string){
  let filteredProjects = [];
  console.log("GETTING PROJECT OPTIONS FOR: ", field);
  
	const filterIndex = Object.keys(projectFilterNames).indexOf(field);

	if(filterIndex === 0) {
    filteredProjects = projects;
  }
	else {
		// Apply all the filters that come before it.
    filteredProjects = projects.filter(project => {
      return Object.keys(projectFilterNames).every((filter) => {
        //if(index < filterIndex) return false;

        const selectedValue = projectFilterNames[filter].label;

        // Stop condition
        if (selectedValue && selectedValue !== project[filter]) {
          return false;
        }
        return true;
      })
    });
	};
  
  // Projects have been filtered. Setting options setting options
	const options: any[] = [];
	const foundLabels: string[] = [];

	// only get filtered elements for previous selections
	filteredProjects.forEach(project => {
		const label = project[field];
		// filter out duplicates and empty values
		if (label?.length > 0 && !foundLabels.find(l => l === label)) {
			foundLabels.push(label);
			options.push(label.toString())
		}
	})

	return options;
}

function handleResetProject() {
	Object.keys(projectFilters).forEach((f, i) => {
		if(i === 0) {
			projectFilters[f].value = ""
			return;
		}
		projectFilters[f] = {value: "", options: []}
	});
}

const projectFilterNames = [
  "contractor",
  "builder",
  "site",
  "address",
  "contact",
  "mobile",
  "timesheetEmail"
]

const projectFilters = reactive({
	"contractor": {value: "", options: getProjectOptions("contractor")},
	"builder": {value: "", options: []},
	"site": {value: "", options: []},
	"address": {value: "", options: []},
	"contact": {value: "", options: []},
	"mobile": {value: "", options: []},
	"timesheetEmail": {value: "", options: []}
});


// Purpose: there are 8 dropdown fields, each filters the json data
// Initial State: Material field has options because it's the first one (All the unique non-empty column values) No other options have values
// User follows the following steps
// 1. Select Material
// Filters json data based on material and Sets the options for the next field which is rate/len (All the unique non-empty column values)
// 2. Select Rate/Len
// Filters json data (adds the filter on top of the previously filtered json) based on rate/len Sets the options for the next field which is dimension (All the unique non-empty column values)
// 3. repeats until the end (careful with the last select)
// Note: if user changes for example RateLen after setting multiple, every select field in front of it will be reset 
function getProjectOptionsByIndex(filterIndex: number) {
	let options = [];

	const nextFilterName = projectFilterNames[filterIndex + 1];
  
	projects.forEach(project => {
		let accept = true;

		Object.keys(project).forEach(key => {
			if (
				projectFilters[key]?.value && 
				projectFilters[key].value !== project[key]
			) {				
				accept = false;
				return;
			}
		})

		const newOption = project[nextFilterName]?.toString();

		// filter-out duplicates and empty values
		accept = accept && newOption?.length > 0 && options.indexOf(newOption) === -1;

		if(accept){
			options.push(project[nextFilterName]);
		}
	});

	return options;
}

// handleClick and reset everything in-front of the current field
function handleSelectProject(filterName: string) {

	const filterIndex = projectFilterNames.indexOf(filterName);

  // Last index
  if(filterIndex === projectFilterNames.length - 1) {
    return;
  }

	// Reset forward to ensure consistency (we cannot use the generic reset method)
	for (let i = filterIndex + 1; i < projectFilterNames.length; i++) {
		const nextFilterName = projectFilterNames[i];
		projectFilters[nextFilterName].value = "";
		projectFilters[nextFilterName].options = [];
	}

	const nextFilterName = projectFilterNames[filterIndex + 1];
	const nextFilter = projectFilters[nextFilterName];

	let options = getProjectOptionsByIndex(filterIndex);

	nextFilter.options = options;

	if(options.length === 1) {
		nextFilter.value = options[0];
	}

	if(options.length === 0 || options.length === 1) {
		handleSelectProject(nextFilterName);
	}

}

// function handleAddProject() { 
// 	const projectObject = {};

// 	for (let key of Object.keys(materialFilters)){ 
// 		projectObject[key] = projectFilters[key].value; 
// 	}
	
// 	projectControls.selectedProjects.push(projectObject); 
// }

//Project Section Ends

/**
 * Todo: New filtering system
 * purpose: dont' let filters apply the filter on themselves
 */
const getMaterialOptions = (field: string) => {
	const options: any[] = [];
	const foundLabels: string[] = [];

	const filterIndex = Object.keys(materialFilterNames).indexOf(field);

	let filteredMaterials = [];

	if(filterIndex === 0) {
    filteredMaterials = materials;
  }
	else {
		// Apply all the filters that come before it.
		filteredMaterials = [];
	};

	filteredMaterials = materials.filter(material => {
		return Object.keys(materialFilterNames).every((filter) => {
			//if(index < filterIndex) return false;

			const selectedValue = materialFilterNames[filter].label;

			// Stop condition
			if (selectedValue && selectedValue !== material[filter]) {
				return false;
			}

			return true;
		})
	});

	// only get filtered elements for previous selections
	filteredMaterials.forEach(material => {
		const label = material[field];
		// filter out duplicates and empty values
		if (label.length > 0 && !foundLabels.find(l => l === label)) {
			foundLabels.push(label);
			options.push(label.toString())
		}
	})

	return options;
}

const materialControls = reactive({
	"quantity": 1,
	"rate": 0,
	"selectedMaterials": [],
  "takeoffPdf": undefined
});

function handleResetMaterial() {
	Object.keys(materialFilters).forEach((f, i) => {
		if(i === 0) {
			materialFilters[f].value = ""
			return;
		}
		materialFilters[f] = {value: "", options: []}
	});
}

const materialFilterNames = reactive({
	"name": "",
	"type": "",
	"dimension": "",
	"grade": "",
	"height": "",
	"floor": "",
	"sqft": "",
	"workType": ""
});

const materialFilters = reactive({
	"name": {value: "", options: getMaterialOptions("name")},
	"type": {value: "", options: []},
	"dimension": {value: "", options: []},
	"grade": {value: "", options: []},
	"height": {value: "", options: []},
	"floor": {value: "", options: []},
	"sqft": {value: "", options: []},
	"workType": {value: "", options: []}
});

// Purpose: there are 8 dropdown fields, each filters the json data
// Initial State: Material field has options because it's the first one (All the unique non-empty column values) No other options have values
// User follows the following steps
// 1. Select Material
// Filters json data based on material and Sets the options for the next field which is rate/len (All the unique non-empty column values)
// 2. Select Rate/Len
// Filters json data (adds the filter on top of the previously filtered json) based on rate/len Sets the options for the next field which is dimension (All the unique non-empty column values)
// 3. repeats until the end (careful with the last select)
// Note: if user changes for example RateLen after setting multiple, every select field in front of it will be reset 
function getMaterialOptionsByIndex(filterIndex: number) {
	let options = [];

	const filterNames = Object.keys(materialFilters);
	const nextFilterName = filterNames[filterIndex + 1];

	materials.forEach(material => {
		let accept = true;

		Object.keys(material).forEach(key => {
			if (
				materialFilters[key]?.value && 
				materialFilters[key].value !== material[key]
			) {				
				accept = false;
				return;
			}
		})

		const newOption = material[nextFilterName].toString();

		// filter-out duplicates and empty values
		accept = accept && newOption?.length > 0 && options.indexOf(newOption) === -1;

		if(accept){
			options.push(material[nextFilterName]);
		}
	});

	return options;
}

// handleClick and reset everything in-front of the current field
function handleSelectMaterial(filterName: string) {

	const filterNames = Object.keys(materialFilters);
	const filterIndex = filterNames.indexOf(filterName);

	// Setting rate... rateLen field will be renamed to type
  // material and rateLen fields are unique identifiers for price.
	if(filterName === "type") {			
		materialControls.rate = 0;

		const materialName = materialFilters["name"].value;
		const materialType = materialFilters["type"].value;

		const materialRate = rates.find(rate => {
			if(rate["name"] && rate["name"] !== materialName) {
				return false;
			}

			if(rate.type && rate.type.length > 0 && rate.type !== materialType) {
				return false;
			}

			return true;
		});

		// for comparison to show the update rate box
		materialControls["oldRate"] = materialRate?.rate ? Number(materialRate.rate) : 0;
		materialControls.rate = materialRate?.rate ? Number(materialRate.rate) : 0;
	}

  // Last index
  if(filterIndex === filterNames.length - 1) {
    return;
  }

	// Reset forward
	for (let i = filterIndex + 1; i < filterNames.length; i++) {
		const nextFilterName = filterNames[i];
		materialFilters[nextFilterName].value = "";
		materialFilters[nextFilterName].options = [];
	}

	const nextFilterName = filterNames[filterIndex + 1];
	const nextFilter = materialFilters[nextFilterName];

	let options = getMaterialOptionsByIndex(filterIndex);

	nextFilter.options = options;

	if(options.length === 1) {
		nextFilter.value = options[0];
	}

	if(options.length === 0 || options.length === 1) {
		handleSelectMaterial(nextFilterName);
	}

}

function handleAddMaterial() { 
	const materialObject = {};
	materialObject["quantity"] = materialControls.quantity;
	materialObject["rate"] = materialControls.rate; 

	for (let key of Object.keys(materialFilters)){ 
		materialObject[key] = materialFilters[key].value; 
	}
	
	materialControls.selectedMaterials.push(materialObject); 
}

function handleResetSelectedMaterials() {
	materialControls.selectedMaterials = [];
}

async function handleEmailTakeoff() {
  console.log("EMAILING TAKEOFF");

  const element = document.getElementById('takeoff-pdf')

  const opt = {
    margin:       0,
    filename:     'takeoff.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  const pdf = await html2pdf().set(opt).from(element).output('blob');
  console.log(pdf);

  const file = new File([pdf], 'my-pdf.pdf', { type: 'application/pdf' });
  let list = new DataTransfer();
  list.items.add(file);
  
  const pdfInput = document.getElementById('takeoff-pdf-input') as HTMLInputElement 

  console.log(pdfInput);

  try {
    pdfInput.files = list.files;
  } catch (error) {
    console.log(error);
  }

  const emailButton = document.getElementById('email-button');

  // emailButton.click();

  let emailUrl = "https://prox-virid.vercel.app/api/email";

  const addParam = (value: string) => {
    emailUrl += `/${value}`
  }

  // {
	// 		"From": "kerem@weareoutpost.ca",
	// 		"To": "keremduran.fw@gmail.com",
	// 		"Subject": "Hello from Postmark",
	// 		"HtmlBody": "<strong>Hello</strong> dear Postmark user.",
	// 		"TextBody": "Hello from Postmark!",
	// 		"MessageStream": "outbound"
	// }

  // addParam("kerem@weareoutpost.ca");
  // addParam("keremduran.fw@gmail.com");
  // addParam("Test Email");
  // addParam("testEmail");
  // addParam("my-pdf.pdf");
  // addParam(pdf);

  async function email(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  email("https://prox-virid.vercel.app/api/email", { answer: 42 }).then((data) => {
    console.log(data); // JSON data parsed by `data.json()` call
  });

  try {
    //@ts-ignore
    const emailResponse = await fetch(emailUrl);
    console.log({emailResponse});
  } catch (error) {
    console.log(error);
  }

  // try {
  //   emailjs.send("service_phkwzcn","template_pz23olr",{
  //   from_name: "ProX Contractors",
  //   to_name: "Client Name",
  //   message: "Here is your takeoff",
  //   attachment: pdf,
  //   reply_to: "test4",
  // }, "rTC3ppKoqqlH4BawQ");
  // } catch (error) {
  //   console.log({error})  
  // }
  

}

const total = computed(() => {
  let sum = 0;
  try {
    materialControls.selectedMaterials.forEach(material => {
    sum += Number(material.quantity) * Number(material.rate);
  })
  } catch (error) {
    console.error(error);
  }

  return sum.toFixed(2);
});


const submit = () => {
	//
}


</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiTableBorder" title="Material Form" main>
				<div>
					<div class="flex justify-between gap-20">
						<span>Document Number:</span>
						<span>{{ documentNo() }}</span>
					</div>
					<div class="flex justify-between gap-20">
						<span>Date:</span>
						<span>{{ documentDate() }}</span>
					</div>
				</div>
			</SectionTitleLineWithButton>
			<SectionTitleLineWithButton :icon="mdiViewDashboard" title="Select Project" />
			<CardBox form @submit.prevent="submit">
        <div>
          <div class="flex flex-wrap gap-4 p-2 pt-4">
            <FormField
              :label="key.toUpperCase()"
              v-for="key in Object.keys(projectFilters)"
            >
              <FormControl 
                v-model="projectFilters[key].value" 
                :options="projectFilters[key].options" 
                @change="handleSelectProject(key)"
              />
            </FormField>
          </div>
        </div>
        <BaseButtons class="p-2 py-4">
					<BaseButton type="reset" @click="handleResetProject" color="info" outline label="Reset" />
				</BaseButtons>
				<BaseDivider />
			</CardBox>
			<SectionTitleLineWithButton :icon="mdiShoppingSearch" title="Select Material" />
			<CardBox form @submit.prevent="submit">
				<div class="overflow-x-scroll p-2">
          <div class="flex flex-wrap gap-4 p-2 pt-4">
            <FormField
              :label="key.toUpperCase()"
              v-for="key in Object.keys(materialFilters)"
            >
              <FormControl 
                v-model="materialFilters[key].value" 
                :options="materialFilters[key].options" 
                @change="handleSelectMaterial(key)"
              />
            </FormField>
          </div>
				</div>
				<div class="flex flex-wrap gap-4 p-2 pt-4">
					<FormField label="QUANTITY">
						<input 
							class="w-full"
							v-model="materialControls['quantity']" 
							type="number"
							name="quantity"
							max="100"
              min="1"
						/>
					</FormField>
					<FormField label="RATE">
						<input 
							class="w-full"
							v-model="materialControls['rate']" 
							type="number"
							name="rate"
							max="10000"
              min="0"
						/>
					</FormField> 
					<FormField label="Update Rate?" 
						v-if="materialControls['rate'] && 
						materialControls['rate'] !== materialControls['oldRate']"
					>
						<input 
							class="p-3"
							v-model="materialControls['updateRate']" 
							type="checkbox"
							name="updateRate"
						/>
					</FormField>
				</div>
				<BaseButtons class="p-2 pt-5">
					<BaseButton 
						type="reset" 
						@click="handleResetMaterial" 
						color="info" 
						outline 
						label="Reset" 
					/>
					<BaseButton 
						type="submit" 
						@click="handleAddMaterial" 
						color="success" 
						outline 
						label="Add Material" 
					/>
				</BaseButtons>
				<BaseDivider />
			</CardBox>
			<SectionTitleLineWithButton :icon="mdiListBoxOutline" title="Selected Materials" />
			<CardBox class="mb-6" has-table>
				<CardBoxComponentEmpty v-if="materialControls.selectedMaterials.length === 0" />
				<TableMaterials v-else :materials="materialControls.selectedMaterials" checkable />
				<BaseButtons class="p-5">
					<BaseButton 
						type="reset" 
						@click="handleResetSelectedMaterials" 
						color="info" 
						outline 
						label="Clear"
					/>
          <BaseButton 
						type="submit" 
						@click="handleEmailTakeoff" 
						color="success" 
						label="Submit Takeoff"
					/>
				</BaseButtons>
				<BaseDivider />
			</CardBox>
      <form class="hidden" id="email-form" action="https://formsubmit.co/kerem@weareoutpost.ca" enctype="multipart/form-data" method="POST" target="_self">
        <input class="hidden" type="email" name="email" :value="projectFilters['Timesheet Email']?.label" placeholder="Email Address">
        <input class="hidden" id="takeoff-pdf-input" type="file" name="attachment" accept="application/pdf">
        <input type="hidden" name="message" value="Your takeoff document.">
        <input type="hidden" name="_next" :value="currentURL()">
        <input type="hidden" name="_subject" value="Your Takeoff">
        <input type="hidden" name="_captcha" value="false">
        <!-- <input type="hidden" name="_autoresponse" value="hello"> -->
        <button id="email-button" type="submit" class="hidden">Submit Form</button>
      </form>
      <div class="hidden">
        <div id="takeoff-pdf" class="p-8 text-white bg-[#1b2e3f] text-[10px] w-[8.5in] min-w-[8.5in] h-[11in] relative">
          <div class="flex justify-between py-5">
            <h1 class="text-[#31a3a4] text-5xl">TAKEOFF</h1>
            <div class="absolute top-0 right-0"><img src="/prox-logo.png" alt="ProX Logo"></div>
          </div>
          <div class="flex justify-between py-5">
            <div class="w-[15rem]">
              <div class="flex justify-between">
                <div>Document Number: </div>
                <div>{{documentNo()}}</div>
              </div>
              <div class="flex justify-between">
                <div>Date: </div>
                <div>{{documentDate()}}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-between py-5">
            <div class="w-[15rem]">
              <div class="flex justify-between">
                <div>Contractor: </div>
                <div>{{projectFilters.contractor}}</div>
              </div>
              <div class="flex justify-between">
                <div>Builder: </div>
                <div>{{projectFilters.builder}}</div>
              </div>
              <div class="flex justify-between">
                <div>Site: </div>
                <div>{{projectFilters.site}}</div>
              </div>
            </div>
            <div class="w-[15rem]">
              <div class="flex justify-between">
                <div>Address: </div>
                <div>{{projectFilters.address}}</div>
              </div>
              <div class="flex justify-between">
                <div>Contact: </div>
                <div>{{projectFilters.contact}}</div>
              </div>
              <div class="flex justify-between">
                <div>Email: </div>
                <div>{{ projectFilters["timesheetEmail"]}}</div>
              </div>
            </div>
          </div>
          <!-- material table -->
          <div class="flex justify-between py-5">
            <div v-if="materialControls.selectedMaterials?.length > 0" class="w-full">
            <!-- thead -->
              <div class="grid grid-cols-10 py-2 pb-5 bg-[#1c4966]">
                <div class="text-center p-1" v-for="field in Object.keys(materialControls.selectedMaterials[0])">
                    {{field.toLocaleUpperCase()}}
                </div>
              </div>
              <!-- tbody -->
              <div>
                <!-- tr -->
                <div class="grid grid-cols-10 py-1 pb-4 bg-white text-black border-2"
                  v-for="material in materialControls.selectedMaterials">
                  <div class="text-center p-1" v-for="field in Object.keys(material)">
                    {{material[field]}}
                  </div>
                </div>
              </div>
              <!-- tfoot -->
              <div class="grid grid-cols-10 py-1 pb-4 bg-white text-black border-2 font-bold">
                <div class="text-center p-1">Total: </div>
                <div class="text-center p-1">{{total}}</div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0"><img class="w-[80%]" src="/prox-footer.png" alt="ProX Contact Info"></div>
        </div>
      </div>
		</SectionMain>
	</LayoutAuthenticated>
</template>
