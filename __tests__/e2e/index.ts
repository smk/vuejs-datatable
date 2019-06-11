import Vue from 'vue';
import { TColumnsDefinition, VuejsDatatableFactory } from '../../dist/vuejs-datatable.esm';

import '../../tutorials/assets/rows';
import { IPeople } from '../../tutorials/src/utils';

declare const rows: IPeople[];
Vue.use( VuejsDatatableFactory );

const priorTestPromise = Promise.resolve();
describe( 'Basic table', () => {
	let mockDiv: HTMLElement | undefined;
	let app: Vue | undefined;
	const appId = 'demo-app';
	const renderPeopleAddress = ( people: IPeople ) => `${ people.address  }, ${  people.city  }, ${  people.state }`;
	beforeEach(() => {
		mockDiv = document.createElement( 'div' );
		mockDiv.innerHTML = `<div id="${appId}">
			<div class="row">
				<div class="col-xs-12 form-inline">
					<div class="form-group">
						<label for="filter" class="sr-only">Filter</label>
						<input type="text" class="form-control" v-model="filter" placeholder="Filter" @keydown="$event.stopImmediatePropagation()">
					</div>
				</div>

				<div class="col-xs-12 table-responsive">
					<datatable :columns="columns" :data="rows" :filter="filter" :per-page="25"></datatable>
					<datatable-pager v-model="page"></datatable-pager>
				</div>
			</div>
		</div>`;
		document.body.appendChild( mockDiv );
		app = new Vue( {
			el: mockDiv,

			data: {
				filter:  '',

				columns: [
					{ label: 'ID', field: 'id', align: 'center', filterable: false },
					{ label: 'Username', field: 'user.username' },
					{ label: 'First Name', field: 'user.first_name' },
					{ label: 'Last Name', field: 'user.last_name' },
					{ label: 'Email', field: 'user.email', align: 'right', sortable: false },
					{ label: 'Address', representedAs: renderPeopleAddress, align: 'right', sortable: false },
				] as TColumnsDefinition<IPeople>,
				page: 1,
				rows,
			},
		} );
	} );
	afterEach(() => {
		app!.$destroy();
		app = undefined;
		document.body.removeChild( mockDiv! );
	} );
	it( 'Should display a row correctly', () => {
		const firstRow = document.querySelector( `#${appId} table tbody tr:first-child` )!;
		expect( firstRow instanceof HTMLTableRowElement ).toBeTruthy();
		expect( firstRow.children.length ).toBe( 6 );
		expect( firstRow.querySelector( ':nth-child(1)' )!.innerHTML.trim() ).toBe( rows[0].id.toString().trim() );
		expect( firstRow.querySelector( ':nth-child(2)' )!.innerHTML.trim() ).toBe( rows[0].user.username.trim() );
		expect( firstRow.querySelector( ':nth-child(3)' )!.innerHTML.trim() ).toBe( rows[0].user.first_name.trim() );
		expect( firstRow.querySelector( ':nth-child(4)' )!.innerHTML.trim() ).toBe( rows[0].user.last_name.trim() );
		expect( firstRow.querySelector( ':nth-child(5)' )!.innerHTML.trim() ).toBe( rows[0].user.email.trim() );
		expect( firstRow.querySelector( ':nth-child(6)' )!.innerHTML.trim() ).toBe( renderPeopleAddress( rows[0] ).trim() );
	} );
	it( 'Should have the correct number of rows', () => {
		const tableBody = document.querySelector( `#${appId} table tbody` )!;
		console.log( tableBody );
		expect( tableBody instanceof HTMLTableSectionElement ).toBeTruthy();
		expect( tableBody.children.length ).toBe( 25 );
	} );
} );
