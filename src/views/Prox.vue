<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue'
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiViewDashboard, mdiBookEdit, mdiAccount, mdiMail, mdiGithub, mdiCloseOctagonOutline, mdiShoppingSearch, mdiListBox, mdiListBoxOutline } from '@mdi/js'
import NotificationBar from '@/components/NotificationBar.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
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

const materials = [
    {
      "id": "material1",
      "material": "Insulation",
      "rateLen": "R12",
      "dimension": "16",
      "grade": "Rockwool",
      "ceilingHeight": "8'",
      "floor": "Garage",
      "sqft": "",
      "workType": "Prep"
    },
    {
      "id": "material2",
      "material": "Insulation",
      "rateLen": "R14",
      "dimension": "16",
      "grade": "Rockwool",
      "ceilingHeight": "9'",
      "floor": "Basement",
      "sqft": "",
      "workType": "Garage"
    },
    {
      "id": "material3",
      "material": "Insulation",
      "rateLen": "R20",
      "dimension": "16",
      "grade": "Rockwool",
      "ceilingHeight": "10'",
      "floor": "Main Floor",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material4",
      "material": "Insulation",
      "rateLen": "R22",
      "dimension": "16",
      "grade": "Rockwool",
      "ceilingHeight": "11'",
      "floor": "Ground Floor",
      "sqft": "49",
      "workType": ""
    },
    {
      "id": "material5",
      "material": "Insulation",
      "rateLen": "R24",
      "dimension": "16",
      "grade": "Rockwool",
      "ceilingHeight": "12'",
      "floor": "1st Floor",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material6",
      "material": "Insulation",
      "rateLen": "R28",
      "dimension": "16",
      "grade": "Rockwool",
      "ceilingHeight": "",
      "floor": "2nd Floor",
      "sqft": "20",
      "workType": ""
    },
    {
      "id": "material7",
      "material": "Insulation",
      "rateLen": "R31",
      "dimension": "16",
      "grade": "Rockwool",
      "ceilingHeight": "",
      "floor": "3rd Floor",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material8",
      "material": "Insulation",
      "rateLen": "R40",
      "dimension": "16",
      "grade": "Rockwool",
      "ceilingHeight": "",
      "floor": "4th Floor",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material9",
      "material": "Insulation",
      "rateLen": "R12",
      "dimension": "24",
      "grade": "Rockwool",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material10",
      "material": "Insulation",
      "rateLen": "R20",
      "dimension": "24",
      "grade": "Rockwool",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material11",
      "material": "Insulation",
      "rateLen": "R22",
      "dimension": "24",
      "grade": "Rockwool",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material12",
      "material": "Insulation",
      "rateLen": "R28",
      "dimension": "24",
      "grade": "Rockwool",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material13",
      "material": "Insulation",
      "rateLen": "R31",
      "dimension": "24",
      "grade": "Rockwool",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material14",
      "material": "Drywall",
      "rateLen": "8'",
      "dimension": "1/2",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "32",
      "workType": ""
    },
    {
      "id": "material15",
      "material": "Drywall",
      "rateLen": "8'",
      "dimension": "5/8",
      "grade": "Firetape",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material16",
      "material": "Drywall",
      "rateLen": "9'",
      "dimension": "1/2",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "36",
      "workType": ""
    },
    {
      "id": "material17",
      "material": "Drywall",
      "rateLen": "9'",
      "dimension": "5/8",
      "grade": "Firetape",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material18",
      "material": "Drywall",
      "rateLen": "10'",
      "dimension": "1/2",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "40",
      "workType": ""
    },
    {
      "id": "material19",
      "material": "Drywall",
      "rateLen": "10'",
      "dimension": "5/8",
      "grade": "Firetape",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material20",
      "material": "Drywall",
      "rateLen": "12'",
      "dimension": "1/2",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "48",
      "workType": ""
    },
    {
      "id": "material21",
      "material": "Drywall",
      "rateLen": "12'",
      "dimension": "5/8",
      "grade": "Firetape",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material22",
      "material": "Resilient Channel",
      "rateLen": "",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material23",
      "material": "Gable",
      "rateLen": "",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material24",
      "material": "Beam pocket",
      "rateLen": "",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material25",
      "material": "Hour",
      "rateLen": "",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material26",
      "material": "Premium",
      "rateLen": "Townhouse",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material27",
      "material": "Premium",
      "rateLen": "Stack Townhouse",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material28",
      "material": "Premium",
      "rateLen": "Energy Start",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material29",
      "material": "Difficulty",
      "rateLen": "Easy",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material30",
      "material": "Difficulty",
      "rateLen": "Medium",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    },
    {
      "id": "material31",
      "material": "Difficulty",
      "rateLen": "Hard",
      "dimension": "",
      "grade": "",
      "ceilingHeight": "",
      "floor": "",
      "sqft": "",
      "workType": ""
    }
]

const projects = [
	{
		"id": "project1",
		"contractor": "Habitat Solutions",
		"builder": "Atha Construction",
		"site": "Cambridge",
		"address": "27 Cambridge St",
		"contact": "Rodrigo",
		"mobile": "(647) 227-4546",
		"Timesheet Email": "luane@habitatsolutions.ca"
	},
	{
		"id": "project2",
		"contractor": "ProX",
		"builder": "Amigoes",
		"site": "Concord",
		"address": "",
		"contact": "",
		"mobile": "",
		"Timesheet Email": "leonardorbc@gmail.com"
	},
	{
		"id": "project3",
		"contractor": "Marel Contractors",
		"builder": "Remington",
		"site": "Brampton",
		"address": "Inspire Blvd",
		"contact": "Daven",
		"mobile": "(647) 244-6436",
		"Timesheet Email": "dvitti@marelcontractors.com"
	},
	{
		"id": "project4",
		"contractor": "Marel Contractors",
		"builder": "Aspenridge",
		"site": "Brampton",
		"address": "Inspire Blvd",
		"contact": "Daven",
		"mobile": "(647) 244-6436",
		"Timesheet Email": "dvitti@marelcontractors.com"
	},
	{
		"id": "project5",
		"contractor": "Marel Contractors",
		"builder": "Countrywide",
		"site": "Caledon",
		"address": "8 Ann Mckee St",
		"contact": "Daven",
		"mobile": "(647) 244-6436",
		"Timesheet Email": "dvitti@marelcontractors.com"
	},
	{
		"id": "project6",
		"contractor": "Marel Contractors",
		"builder": "Mattamy",
		"site": "Mississauga",
		"address": "5150 Ninth Line",
		"contact": "Daven",
		"mobile": "(647) 244-6436",
		"Timesheet Email": "dvitti@marelcontractors.com"
	}
]

const rates = [
  {
    "material": "Insulation",
    "type": "",
    "rate": "0.605"
  },
  {
    "material": "Drywall",
    "type": "8'",
    "rate": "0.345"
  },
  {
    "material": "Drywall",
    "type": "9'",
    "rate": "0.366"
  },
  {
    "material": "Drywall",
    "type": "10'",
    "rate": "0.414"
  },
  {
    "material": "Drywall",
    "type": "11'",
    "rate": "0.442"
  },
  {
    "material": "Drywall",
    "type": "12'",
    "rate": "0.457"
  },
  {
    "material": "Frame",
    "type": "8'",
    "rate": "0.336"
  },
  {
    "material": "Frame",
    "type": "9'",
    "rate": "0.354"
  },
  {
    "material": "Frame",
    "type": "10'",
    "rate": "0.376"
  },
  {
    "material": "Frame",
    "type": "11'",
    "rate": "0.395"
  },
  {
    "material": "Frame",
    "type": "12'",
    "rate": "0.415"
  },
  {
    "material": "Resilient Channel",
    "type": "8'",
    "rate": "0.336"
  },
  {
    "material": "Resilient Channel",
    "type": "9'",
    "rate": "0.354"
  },
  {
    "material": "Resilient Channel",
    "type": "10'",
    "rate": "0.376"
  },
  {
    "material": "Resilient Channel",
    "type": "11'",
    "rate": "0.395"
  },
  {
    "material": "Resilient Channel",
    "type": "12'",
    "rate": "0.415"
  },
  {
    "material": "Suspended Ceiling",
    "type": "",
    "rate": "0.65"
  },
  {
    "material": "T-bar",
    "type": "",
    "rate": "0.65"
  },
  {
    "material": "Ceiling Tile",
    "type": "",
    "rate": "0.65"
  },
  {
    "material": "R24",
    "type": "",
    "rate": "0.059"
  },
  {
    "material": "Rockwool",
    "type": "",
    "rate": "0.077"
  },
  {
    "material": "5/8",
    "type": "",
    "rate": "0.103"
  },
  {
    "material": "Townhouse",
    "type": "",
    "rate": "0.014"
  },
  {
    "material": "Energy Star",
    "type": "",
    "rate": "0.077"
  },
  {
    "material": "Stack Townhouse",
    "type": "",
    "rate": "0.04"
  },
  {
    "material": "Beam pocket",
    "type": "",
    "rate": "50"
  },
  {
    "material": "Gable",
    "type": "",
    "rate": "75"
  }
]




const projectFilters = reactive({
	"contractor": "",
	"builder": "",
	"site": "",
	"address": "",
	"contact": "",
	"mobile": "",
	"Timesheet Email": ""
});

const materialFilterNames = reactive({
	"material": "",
	"rateLen": "",
	"dimension": "",
	"grade": "",
	"ceilingHeight": "",
	"floor": "",
	"sqft": "",
	"workType": ""
});

let filteredProjects = computed(() => {
	return projects.filter(project => {
		
		return Object.keys(projectFilters).every(filter => {
			const selectedValue = projectFilters[filter].label;

			// Stop condition
			if (selectedValue && selectedValue !== project[filter]) {
				return false;
			}

			return true;
		})
	});
});

const getContractorOptions = (field = 'contractor') => {
	const options: any[] = [];
	const foundLabels: string[] = [];

	projects.forEach(project => {
		const label = project[field];
		if (label.length > 0 && !foundLabels.find(l => l === label)) {
			foundLabels.push(label);
			options.push({ id: project.id, label: label })
		}
	})

	if(options.length === 1) projectFilters[field] = options[0]

	return options;
}

const getProjectOptions = (field: string) => {
	const options: any[] = [];
	const foundLabels: string[] = [];

	// only get filtered elements for previous selections
	filteredProjects.value.forEach(project => {
		const label = project[field];
		if (label.length > 0 && !foundLabels.find(l => l === label)) {
			foundLabels.push(label);
			options.push({ id: project.id, label: label })
		}
	})

	return options;
}

/**
 * Todo: New filtering system
 * purpose: dont' let filters apply the filter on themselves
 */


const getMaterialOptions = (field: string) => {
	const options: any[] = [];
	const foundLabels: string[] = [];

	const filterIndex = Object.keys(materialFilterNames).indexOf(field);

	let filteredMaterials = [];

	if(filterIndex === 0) filteredMaterials = materials;
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

watchEffect(() => {
  // Loop through all the fields
  Object.keys(projectFilters).forEach(field => {
    // Get the options for each field
    const options = field === 'contractor' ? getContractorOptions() : getProjectOptions(field)
    // If there is only one option, assign it to projectFilters
    if (options.length === 1) {
      projectFilters[field] = options[0]
    }
  })
})

const submit = () => {
	//
}

// handleClick and reset everything in-front of the current field
function handleSelectProject(key: string) {
	let forward = false;
	Object.keys(projectFilters).forEach(filter => {
		if(forward) {
			projectFilters[filter] = "";
		}

		if(filter === key) forward = true;
	})
}

function handleResetProject() {
	Object.keys(projectFilters).forEach(f => projectFilters[f] = "");
}

function handleResetMaterial() {
	Object.keys(materialFilters).forEach((f, i) => {
		if(i === 0) {
			materialFilters[f].value = ""
			return;
		}
		materialFilters[f] = {value: "", options: []}
	});
}

const materialFilters = reactive({
	"material": {value: "", options: getMaterialOptions("material")},
	"rateLen": {value: "", options: []},
	"dimension": {value: "", options: []},
	"grade": {value: "", options: []},
	"ceilingHeight": {value: "", options: []},
	"floor": {value: "", options: []},
	"sqft": {value: "", options: []},
	"workType": {value: "", options: []}
});

const materialControls = reactive({
	"quantity": 1,
	"rate": 0,
	"selectedMaterials": []
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
	if(filterName === "rateLen") {			
		materialControls.rate = 0;

		const materialName = materialFilters["material"].value;
		const materialType = materialFilters["rateLen"].value;

		const materialRate = rates.find(rate => {
			if(rate.material && rate.material !== materialName) {
				return false;
			}

			if(rate.type && rate.type.length > 0 && rate.type !== materialType) {
				return false;
			}

			return true;
		});

		// for comparison to show the update rate box
		materialControls["oldRate"] = Number(materialRate.rate);
		materialControls.rate = Number(materialRate.rate);
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
	console.log("test");
	
	materialControls.selectedMaterials = [];
}

</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiTableBorder" title="Material Form" main>
				<div>
					<div class="flex justify-between gap-20">
						<span>Document Number:</span>
						<span>836</span>
					</div>
					<div class="flex justify-between gap-20">
						<span>Date:</span>
						<span>Oct 19, 2023</span>
					</div>
				</div>
			</SectionTitleLineWithButton>
			<SectionTitleLineWithButton :icon="mdiViewDashboard" title="Select Project" />
			<CardBox form @submit.prevent="submit">
        <div class="overflow-x-scroll">
          <div class="w-max flex flex-row gap-4 p-2">
            <FormField label="CONTRACTOR">
              <FormControl 
                v-model="projectFilters['contractor']" 
                :options="getContractorOptions()"
                @change="handleSelectProject('contractor')"
              />
            </FormField>
            <FormField
              :label="key.toUpperCase()"
              v-for="key in Object.keys(projectFilters).filter(p => p !== 'contractor')"
            >
              <FormControl 
                v-model="projectFilters[key]" 
                :options="getProjectOptions(key)" 
                @change="handleSelectProject(key)"
              />
            </FormField>
          </div>
        </div>
        <BaseButtons class="py-4">
					  <BaseButton type="reset" @click="handleResetProject" color="info" outline label="Reset" />
				  </BaseButtons>
				<BaseDivider />
			</CardBox>
			<SectionTitleLineWithButton :icon="mdiShoppingSearch" title="Select Material" />
			<CardBox form @submit.prevent="submit">
				<div class="overflow-x-scroll">
          <div class="w-max flex flex-row gap-4 p-2">
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
				<div class="grid gap-10 grid-cols-6 py-5">
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
				<BaseButtons class="pt-5">
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
				<TableSampleClients v-else :materials="materialControls.selectedMaterials" checkable />
				<BaseButtons>
					<BaseButton 
						type="reset" 
						@click="handleResetSelectedMaterials" 
						color="info" 
						outline 
						label="Clear"
					/>
				</BaseButtons>
				<BaseDivider />
			</CardBox>
		</SectionMain>
	</LayoutAuthenticated>
</template>
