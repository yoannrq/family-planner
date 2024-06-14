<page>
  <actionBar title="header" flat="true">
    <button text="{partialName}" class="rounded-full text-white bg-orange-400 size-10" on:tap="{profilPage}" />
    <actionItem on:tap="{profilPage}" ios.position="right" android.position="actionBar">
      <label class="material-icons text-black">settings</label>
    </actionItem>
  </actionBar>
</page>

<script>
  import { navigate } from 'svelte-native';
  import Home from './Home.svelte';

  const partialName = "Y";
  const profilPage = () => navigate({ page: Home });
</script>

<style>
  @import 'tailwindcss/tailwind.css';
  @import 'material-icons/iconfont/material-icons.css';

  .material-icons {
    font-family: 'Material Icons';
    font-size: 24px;
    line-height: 24px;
  }
</style>
