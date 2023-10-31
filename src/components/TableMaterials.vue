<script setup>
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiPen, mdiTrashCan } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const props = defineProps({
  checkable: Boolean,
  materials: Array
})


const mainStore = useMainStore()

const items = computed(() => mainStore.clients)

const isModalActive = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(5)

const currentPage = ref(0)

const checkedRows = ref([])

const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const total = computed(() => {
  let sum = 0;
  try {
    props.materials.forEach(material => {
    sum += Number(material.quantity) * Number(material.rate);
  })
  } catch (error) {
    console.error(error);
  }

  return sum.toFixed(2);
});

const remove = (arr, cb) => {
  const newArr = []

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, material) => {
  if (isChecked) {
    checkedRows.value.push(material)
  } else {
    // Todo: remove row
    console.log("Will be implemented...");
    //checkedRows.value = remove(checkedRows.value, (row) => row.id === client.id)
  }
}

</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Edit material</p>
  </CardBoxModal>

  <CardBoxModal v-model="isModalDangerActive" title="Please confirm" button="danger" has-cancel>
    <p>Remove material?</p>
  </CardBoxModal>

  <div class="overflow-x-scroll">
    <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th v-for="field in Object.keys(materials[0])">{{field.toLocaleUpperCase()}}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for = "(material, index) in materials">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, index)" />
        <td v-for="field in Object.keys(material)">
          <div class="flex justify-between w-full">
            <div class="lg:invisible font-bold uppercase">
              {{field}}
            </div>
            <div>
              {{material[field]}}
            </div>
          </div>
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiPen" small @click="isModalActive = true" />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="font-bold">
        <td v-if="checkable" />
        <td>Total</td>
        <td>{{ total }}$</td>
      </tr>
  </tfoot>
  </table>
  </div>

</template>
