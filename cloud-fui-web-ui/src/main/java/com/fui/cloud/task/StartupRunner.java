package com.fui.cloud.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

public class StartupRunner implements CommandLineRunner {

    @Autowired
    private FuiTask fuiTask;

    @Override
    public void run(String... args) throws Exception {
        fuiTask.runTask();
    }
}
