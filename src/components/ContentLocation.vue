<template>
        <header class="content-header">
            <div class="row">
                <div class="col-sm-6 d-md-flex align-items-center w-100">
                    <h1 class="m-0 main-header-title">{{ $props.locationName }}</h1>
                    <template
                        v-if="pageData.locations.length > 0"
                    >
                    <ol class="breadcrumb ps-3">
                        <li class="breadcrumb-item">
                            <a href="#">Home</a>
                        </li>
                        <template
                            v-for="(location, index) in pageData.locations" 
                            :key="location.menuId"
                        >
                        <li class="breadcrumb-item"
                            :class="(index === (pageData.locations.length -1)  ?'active' :'' ) "
                        >
                            <a href="#">{{ location.menuName }}</a>
                        </li>
                        </template>
                        <li class="bookmark-star"><button class="btn add-bookmark" data-bs-toggle="button"></button></li>
                    </ol>
                    </template>
                </div>
            </div>
        </header>
        
</template>
<script src="./ContentLocation.js"></script>

<style>

</style>