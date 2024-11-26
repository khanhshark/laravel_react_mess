<?php
$query =User::select(['users.*','messages.message as last_message','messages.created_at as last_message_date']);