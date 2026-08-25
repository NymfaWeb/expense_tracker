<template>
  <div class="flex min-h-screen w-full bg-background dark">
    <Sidebar />
    <div class="flex flex-1 flex-col">
      <Header />
      <main class="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
