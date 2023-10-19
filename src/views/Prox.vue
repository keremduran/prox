<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiAccount, mdiMail, mdiGithub, mdiCloseOctagonOutline } from '@mdi/js'
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

const projects = [
	{
		"id": "project1",
		"contractor": "Habitat Solutions",
		"builder": "Atha Construction",
		"site": "Cambridge",
		"address": "27 Cambridge St",
		"contact": "Rodrigo",
		"mobile": "(647) 227-4546",
		"timesheetEmail": "luane@habitatsolutions.ca"
	},
	{
		"id": "project2",
		"contractor": "ProX",
		"builder": "Amigoes",
		"site": "Concord",
		"address": "",
		"contact": "",
		"mobile": "",
		"timesheetEmail": "leonardorbc@gmail.com"
	},
	{
		"id": "project3",
		"contractor": "Marel Contractors",
		"builder": "Remington",
		"site": "Brampton",
		"address": "Inspire Blvd",
		"contact": "Daven",
		"mobile": "(647) 244-6436",
		"timesheetEmail": "dvitti@marelcontractors.com"
	},
	{
		"id": "project4",
		"contractor": "Marel Contractors",
		"builder": "Aspenridge",
		"site": "Brampton",
		"address": "Inspire Blvd",
		"contact": "Daven",
		"mobile": "(647) 244-6436",
		"timesheetEmail": "dvitti@marelcontractors.com"
	},
	{
		"id": "project5",
		"contractor": "Marel Contractors",
		"builder": "Countrywide",
		"site": "Caledon",
		"address": "8 Ann Mckee St",
		"contact": "Daven",
		"mobile": "(647) 244-6436",
		"timesheetEmail": "dvitti@marelcontractors.com"
	},
	{
		"id": "project6",
		"contractor": "Marel Contractors",
		"builder": "Mattamy",
		"site": "Mississauga",
		"address": "5150 Ninth Line",
		"contact": "Daven",
		"mobile": "(647) 244-6436",
		"timesheetEmail": "dvitti@marelcontractors.com"
	}
]

import { useMainStore } from '@/stores/main'


const projectFilters = reactive({
	"contractor": "",
	"builder": "",
	"site": "",
	"address": "",
	"contact": "",
	"mobile": "",
	"timesheetEmail": ""
});

const itemForm = reactive({
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

	filteredProjects.value.forEach(project => {
		const label = project[field];
		if (label.length > 0 && !foundLabels.find(l => l === label)) {
			foundLabels.push(label);
			options.push({ id: project.id, label: label })
		}
	})

	if(options.length === 1) projectFilters[field] = options[0]

	return options;
}

const selectOptions = [
	{ id: 1, label: 'Business development' },
	{ id: 2, label: 'Marketing' },
	{ id: 3, label: 'Sales' }
]

const form = reactive({
	name: 'John Doe',
	email: 'john.doe@example.com',
	phone: '',
	department: selectOptions[0],
	subject: '',
	question: ''
})

const submit = () => {
	//
}

// handleClick and reset everything in-front of the current field
function handleSelect(key: string) {
	let forward = false;
	Object.keys(projectFilters).forEach(filter => {
		if(forward) {
			projectFilters[filter] = "";
		}

		if(filter === key) forward = true;
	})
}

function handleResetProject() {
	Object.keys(projectFilters).forEach(s => projectFilters[s] = "");
}

</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiTableBorder" title="Tables" main>
				<BaseButton href="https://github.com/justboil/admin-one-vue-tailwind" target="_blank" :icon="mdiGithub"
					label="Star on GitHub" color="contrast" rounded-full small />
			</SectionTitleLineWithButton>
			<CardBox form @submit.prevent="submit">
				<FormField label="Project">
					<FormControl 
						v-model="projectFilters['contractor']" 
						:options="getContractorOptions()"
						@change="handleSelect('contractor')"
					/>
					<FormControl 
						v-for="key in Object.keys(projectFilters).filter(p => p !== 'contractor')"
						v-model="projectFilters[key]" 
						:options="getProjectOptions(key)" 
						@change="handleSelect(key)"
					/>
				</FormField>

				<BaseDivider />

				<template #footer>
					<BaseButtons>
						<BaseButton type="submit" color="info" label="Submit" />
						<BaseButton type="reset" color="info" outline label="Reset" @click="handleResetProject" />
					</BaseButtons>
				</template>
			</CardBox>
			<CardBox form @submit.prevent="submit">
				<FormField label="Question" help="Your question. Max 255 characters">
					<FormControl type="textarea" placeholder="Explain how we can help you" />
				</FormField>
				<FormField label="Grouped with icons">
					<FormControl v-model="form.name" :icon="mdiAccount" />
					<FormControl v-model="form.email" type="email" :icon="mdiMail" />
				</FormField>

				<FormField label="With help line" help="Do not enter the leading zero">
					<FormControl v-model="form.phone" type="tel" placeholder="Your phone number" />
				</FormField>

				<FormField label="Dropdown">
					<FormControl v-model="form.department" :options="selectOptions" />
				</FormField>

				<BaseDivider />

				<FormField label="Question" help="Your question. Max 255 characters">
					<FormControl type="textarea" placeholder="Explain how we can help you" />
				</FormField>

				<template #footer>
					<BaseButtons>
						<BaseButton type="submit" color="info" label="Submit" />
						<BaseButton type="reset" color="info" outline label="Reset" />
					</BaseButtons>
				</template>
			</CardBox>
			<NotificationBar color="info" :icon="mdiMonitorCellphone">
				<b>Responsive table.</b> Collapses on mobile
			</NotificationBar>

			<CardBox class="mb-6" has-table>
				<TableSampleClients checkable />
			</CardBox>

			<SectionTitleLineWithButton :icon="mdiTableOff" title="Empty variation" />

			<NotificationBar color="danger" :icon="mdiTableOff">
				<b>Empty table.</b> When there's nothing to show
			</NotificationBar>

			<CardBox>
				<CardBoxComponentEmpty />
			</CardBox>
		</SectionMain>
	</LayoutAuthenticated>
</template>
