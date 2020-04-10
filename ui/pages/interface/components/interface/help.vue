<template>
  <div>
    <h1 class="title is-4">HELP</h1>
    <h2 class="title is-5">Predefined vars</h2>
    <div class="block">
      <table class="table">
        <thead>
          <th>Variable name</th>
          <th>meaning</th>
          <th>sql example</th>
          <th>eval example</th>
        </thead>
        <tbody>
          <tr>
            <td>last_run</td>
            <td>last interface created</td>
            <td>where created > :last_run</td>
            <td>data.created > :last_run</td>
          </tr>
          <tr>
            <td>output_ident</td>
            <td>current output identifier</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>interface_name</td>
            <td>current interface_name/code</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>interface_description</td>
            <td>current interface description</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>start_run_date</td>
            <td>current start run date</td>
            <td>where created > :start_run_date</td>
            <td>created > :start_run_date</td>
          </tr>
        </tbody>
      </table>
      <h2 class="title is-5">Postdefined vars</h2>
      <div class="block">
        <table class="table">
          <thead>
            <th>Variable name</th>
            <th>meaning</th>
            <th>sql example</th>
            <th>eval example</th>
          </thead>
          <tbody>
            <tr>
              <td>end_run</td>
              <td>end date of current job</td>
              <td>Interface ended at :end_run</td>
              <td></td>
            </tr>
            <tr>
              <td>total_rows</td>
              <td>Total rows</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>:job_status</td>
              <td>current job status</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>:job_error</td>
              <td>current job error</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "source"
};
</script>