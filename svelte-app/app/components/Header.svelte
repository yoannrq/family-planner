<page>
  <actionBar flat="true">
    <actionItem ios.position="left" android.position="actionBar">
      <button text="{partialName}" class="text-white bg-orange-400 rounded-full size-10" on:tap="{profilPage}" />
    </actionItem>
      <button text="{partialName}" class="text-white bg-orange-400 rounded-full size-10" on:tap="{profilPage}" />
    <actionItem on:tap="{profilPage}" ios.position="right" android.position="actionBar">
      <flexboxLayout class="pr-3">
        <image src="~/images/settings.png" class="size-8" />
      </flexboxLayout>
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

</style>
